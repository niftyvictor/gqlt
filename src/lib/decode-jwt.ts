import * as jwt from "jsonwebtoken";

interface GenerateJWTParams {
  userId: string;
  defaultRole: string;
  allowedRoles: string[];
  otherClaims?: Record<string, string | string[]>;
}

const secret: { type: "HS256"; key: string } = JSON.parse(
  process.env.HASURA_GRAPHQL_JWT_SECRET || "{}"
);

const JWT_CONFIG = {
  algorithm: secret.type,
  expiresIn: "10h",
};

export function decodeJWT(token: string): { userId: string } {
  const decoded = jwt.verify(token, secret.key, {
    algorithms: [secret.type],
  }) as { sub: string };

  return { userId: decoded.sub };
}
