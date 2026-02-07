import { ac, roles } from "./roles.js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { admin, apiKey, bearer, openAPI, organization } from "better-auth/plugins";

export interface CreateAuthConfig {
  database: Parameters<typeof drizzleAdapter>[0];
  schema: Record<string, unknown>;
  trustedOrigins: string[];
  defaultRole?: string;
}

export function createAuth(config: CreateAuthConfig) {
  return betterAuth({
    trustedOrigins: config.trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    database: drizzleAdapter(config.database, {
      provider: "pg",
      schema: config.schema,
    }),
    plugins: [
      apiKey(),
      bearer(),
      openAPI(),
      admin({
        ac: ac as any,
        roles,
        defaultRole: config.defaultRole ?? "customer",
      }),
      organization(),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
