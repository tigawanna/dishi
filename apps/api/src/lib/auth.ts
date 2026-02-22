import { db } from "@backend/db/client";
import { AUTHORIZED_ORIGINS } from "@backend/utils/constants";
import { organizationAc, organizationRoles } from "@repo/isomorphic/auth-roles";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, bearer, openAPI, organization, multiSession } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "Dishi",
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

// const SET_ACTIVE_PATH = "/api/auth/multi-session/set-active";
// const MAIN_COOKIE_PREFIX = "better-auth.session_token=";
// const MULTI_COOKIE_PREFIX = "better-auth.session_token_multi-";

// function escapeRegex(str: string): string {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// }

// export async function authHandler(request: Request): Promise<Response> {
//   const url = new URL(request.url);

//   console.log(`[authHandler] ${request.method} ${url.pathname}`);

//   if (url.pathname !== SET_ACTIVE_PATH || request.method !== "POST") {
//     return auth.handler(request);
//   }

//   console.log("[authHandler] intercepted set-active request");

//   const cookieHeader = request.headers.get("cookie") || "";
//   const cookieParts = cookieHeader.split(";").map((c) => c.trim());
//   const hasMainSession = cookieParts.some((c) => c.startsWith(MAIN_COOKIE_PREFIX));

//   console.log("[authHandler] hasMainSession:", hasMainSession);
//   console.log("[authHandler] cookie names:", cookieParts.map((c) => c.split("=")[0]));

//   if (hasMainSession) {
//     console.log("[authHandler] main session exists, passing through");
//     return auth.handler(request);
//   }

//   try {
//     const cloned = request.clone();
//     const body = await cloned.json();
//     const sessionToken = body?.sessionToken;

//     console.log("[authHandler] sessionToken from body:", sessionToken);

//     if (typeof sessionToken !== "string") {
//       console.log("[authHandler] sessionToken is not a string, passing through");
//       return auth.handler(request);
//     }

//     const targetKey = `${MULTI_COOKIE_PREFIX}${sessionToken.toLowerCase()}`;
//     console.log("[authHandler] looking for cookie:", targetKey);

//     const escaped = escapeRegex(targetKey);
//     const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]+)`));

//     console.log("[authHandler] cookie match found:", !!match);

//     if (!match) {
//       console.log("[authHandler] no matching multi-session cookie, passing through");
//       return auth.handler(request);
//     }

//     const injected = `${MAIN_COOKIE_PREFIX}${match[1]}; ${cookieHeader}`;
//     const headers = new Headers(request.headers);
//     headers.set("cookie", injected);

//     console.log("[authHandler] injected main session cookie, forwarding to auth.handler");

//     const response = await auth.handler(
//       new Request(request.url, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(body),
//       }),
//     );

//     console.log("[authHandler] auth.handler response status:", response.status);

//     return response;
//   } catch (err) {
//     console.error("[authHandler] error:", err);
//     return auth.handler(request);
//   }
// }

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
