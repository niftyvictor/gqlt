import { PrismaClient } from "@prisma/client";
import { object, number, InferType } from "yup";
import { v4 as uuid } from "uuid";
import sql from "sql-tagged-template-literal";
import to from "await-to-js";
import { resErrGql, resSuccGql } from "../lib";

export const track = ({ prisma }: { prisma: PrismaClient }) => {
  const schema = object({ lat: number().required(), lng: number().required() });

  return async (_, payload: InferType<typeof schema>, { userId }) => {
    if (!userId) return resErrGql(new Error("User not found"));
    const [validationError] = await to(schema.validate(payload));
    if (validationError) return resErrGql(validationError);

    const id = uuid();
    const lat = payload.lat;
    const lng = payload.lng;

    const query = sql`
    INSERT INTO "UserLocation" ("id", "coords", "userId")
    VALUES (${id}, ST_GeomFromText('POINT(${lat} ${lng})', 4326), ${userId});
    `;

    const [locationError, response] = await to(prisma.$queryRawUnsafe(query));
    if (locationError) return resErrGql(locationError);

    return resSuccGql(true);
  };
};
