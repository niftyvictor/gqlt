import { Request, Response } from "express";
import { object, string, InferType } from "yup";
import { PrismaClient } from "@prisma/client";
import to from "await-to-js";
import bcrypt from "bcrypt";

import { generateJWT, resErrApi, resSuccApi } from "../lib";

export const authenticate = ({ prisma }: { prisma: PrismaClient }) => {
  const schema = object({
    email: string().email().required(),
    password: string().required(),
  });

  return async (
    req: Request<{}, {}, InferType<typeof schema>>,
    res: Response
  ) => {
    const [validationError] = await to(schema.validate(req.body));
    if (validationError) return resErrApi(res, validationError);

    const { email, password } = req.body;

    let [userError, user] = await to(
      prisma.user.findFirst({ where: { email } })
    );
    if (userError) return resErrApi(res, userError);
    if (!user) return resErrApi(res, new Error("User not found"));

    const [passwordError, passwordMatch] = await to(
      bcrypt.compare(password, user.password)
    );
    if (passwordError) return resErrApi(res, passwordError);
    if (!passwordMatch) return resErrApi(res, new Error("User not found"));

    return resSuccApi(res, {
      token: generateJWT({
        userId: user.id,
        defaultRole: "admin",
        allowedRoles: ["admin"],
        otherClaims: {
          "X-Hasura-User-Id": user.id,
        },
      }),
    });
  };
};
