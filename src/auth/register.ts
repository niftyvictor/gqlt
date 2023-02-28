import { Request, Response } from "express";
import { object, string, InferType } from "yup";
import bcrypt from "bcrypt";
import to from "await-to-js";

import { generateJWT, resErrApi, resSuccApi } from "../lib";
import { PrismaClient } from "@prisma/client";

export const register = ({ prisma }: { prisma: PrismaClient }) => {
  const schema = object({
    email: string().email().required(),
    password: string().required(),
    firstName: string().required(),
    lastName: string().required(),
    gender: string().oneOf(["male", "female", "other"]).required(),
  });

  return async (
    req: Request<{}, {}, InferType<typeof schema>>,
    res: Response
  ) => {
    const [validationError] = await to(schema.validate(req.body));
    if (validationError) return resErrApi(res, validationError);

    const { email, password, firstName, lastName, gender } = req.body;

    const [passwordError, encryptedPassword] = await to(
      bcrypt.hash(password, 10)
    );
    if (passwordError) return resErrApi(res, passwordError);

    const payload = {
      email,
      password: encryptedPassword,
      firstName,
      lastName,
      gender,
    };

    let [userError, user] = await to(prisma.user.create({ data: payload }));
    if (userError) return resErrApi(res, userError);

    return resSuccApi(res, {
      token: generateJWT({
        userId: user.id,
        defaultRole: "user",
        allowedRoles: ["user"],
        otherClaims: {
          "X-Hasura-User-Id": user.id,
        },
      }),
    });
  };
};
