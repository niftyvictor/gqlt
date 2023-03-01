import { PrismaClient } from "@prisma/client";
import { object, number, InferType } from "yup";
import sql from "sql-tagged-template-literal";
import to from "await-to-js";
import { resErrGql, resSuccGql } from "../lib";

export const findUsersInRadius = ({ prisma }: { prisma: PrismaClient }) => {
  const schema = object({
    lat: number().required(),
    lng: number().required(),
    radius: number().required(),
  });

  return async (_, payload: InferType<typeof schema>, { userId }) => {
    if (!userId) return resErrGql(new Error("User not found"));
    const [validationError] = await to(schema.validate(payload));
    if (validationError) return resErrGql(validationError);

    const query = sql`
  SELECT DISTINCT ON ("User"."id")
    "User".*
  FROM
    "User"
    INNER JOIN "UserLocation" ON "User"."id" = "UserLocation"."userId"
  WHERE
    ST_DWithin("UserLocation"."coords", ST_MakePoint(${payload.lng},${payload.lat})::geography, ${payload.radius})`;

    const [locationError, response] = await to(prisma.$queryRawUnsafe(query));
    if (locationError) return resErrGql(locationError);

    return resSuccGql({ User: response });
  };
};
