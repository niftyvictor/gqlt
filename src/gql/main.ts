import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { decodeJWT } from "../lib";
import { track } from "./track";
import { findUsersInRadius } from "./findUsersInRadius";

const prisma = new PrismaClient();

const typeDefs = gql`
  type Query {
    hello: String
    findUsersInRadius(
      lat: Float!
      lng: Float!
      radius: Int!
    ): UsersInRadiusResponse
  }

  type Mutation {
    track(lat: Float!, lng: Float!): TrackResponse
  }

  type TrackResponse {
    success: Boolean!
    message: String
    code: Int!
  }

  type UsersInRadiusResponse {
    success: Boolean!
    message: String
    code: Int!
    User: [User]!
  }

  type User {
    id: String!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
    gender: String!
  }
`;

const resolvers = {
  Query: {
    hello: async () => {
      return "world!";
    },
    findUsersInRadius: findUsersInRadius({ prisma }),
  },
  Mutation: {
    track: track({ prisma }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    if (!auth) return { userId: null };

    const token = auth.split("Bearer ")[1];
    if (!token) return { userId: null };

    const { userId } = decodeJWT(token);
    if (!userId) return { userId: null };

    return { userId };
  },
});

server.listen({ port: process.env.GQL_PORT }).then(({ url }) => {
  console.log(`🚀 Gql server running on port ${process.env.GQL_PORT}`);
});
