import express from "express";

import { PrismaClient } from "@prisma/client";

import { register } from "./register";
import { authenticate } from "./authenticate";

const app = express();

// Parse JSON in request bodies
app.use(express.json());

const prisma = new PrismaClient();

app.post("/auth/register", register({ prisma }));
app.post("/auth/authenticate", authenticate({ prisma }));

app.listen(process.env.AUTH_PORT, () => {
  console.log(`🚀 Auth server running on port ${process.env.AUTH_PORT}.`);
});
