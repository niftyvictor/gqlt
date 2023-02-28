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

export function generateJWT(params: GenerateJWTParams): string {
  const payload = {
    sub: params.userId,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": params.allowedRoles,
      "x-hasura-default-role": params.defaultRole,
      ...params.otherClaims,
    },
  };
  return jwt.sign(payload, secret.key, JWT_CONFIG);
}
