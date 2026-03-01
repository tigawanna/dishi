import { db } from "@elysia-api/db/client";
import { AUTHORIZED_ORIGINS } from "@elysia-api/utils/constants";
import { organizationAc, organizationRoles } from "@repo/isomorphic/auth-roles";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, bearer, multiSession, openAPI, organization } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
export const auth = betterAuth({
  appName: "Dishi",
  trustedOrigins: AUTHORIZED_ORIGINS,
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    disabled: false,
    disableColors: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  hooks: {
    //  not working consider a cutom auth endpoint with custom cookie sending
    // after: createAuthMiddleware(async (ctx) => {
    //   const newSession = ctx.context.newSession;
    //   if (!newSession) return;
    //   console.log("========= after - newSession:", newSession);
    //   ctx.setCookie("test", "test", {
    //     httpOnly: true,
    //     secure: true,
    //     maxAge: 60 * 60 * 24 * 30,
    //     path: "/",
    //   });
    //   console.log("========= after - authCookies:", ctx.context.authCookies);
    //   console.log("---  aftre headers -- ",ctx.headers)
    //   const { name, attributes } = ctx.context.authCookies.sessionToken;
    //   await ctx.setSignedCookie(name, newSession.session.token, ctx.context.secret, attributes);
    // }),
  },

  plugins: [
    tanstackStartCookies(),
    apiKey(),
    bearer(),
    openAPI(),
    multiSession({
      maximumSessions: 5,
    }),
    admin({
      defaultRole: "user",
    }),
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
