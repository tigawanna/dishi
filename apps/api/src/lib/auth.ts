import { db } from "@backend/db/client";
import { AUTHORIZED_ORIGINS } from "@backend/utils/constants";
import { organizationAc, organizationRoles } from "@repo/isomorphic/auth-roles";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, bearer, openAPI, organization } from "better-auth/plugins";

export const auth = betterAuth({
  appName:"Dishi",
  trustedOrigins: AUTHORIZED_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),

  plugins: [
    // tanstackStartCookies(),
    apiKey(),
    bearer(),
    openAPI(),
    admin(),
    organization({
      ac: organizationAc,
      roles: organizationRoles,
      adminRoles: ["owner", "manager"],
    }),
  ],
  experimental: {
    joins: true,
  },
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const BetterAuthOpenAPI = {
  getPaths: (prefix = "/api/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          // ignore the as any type cast below it is very intentional
          const operation = (reference[key] as any)[method];

          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
