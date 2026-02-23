import { auth } from "@backend/lib/auth";
import { Elysia, t } from "elysia";

function extractMultiSessionCookieValue(
  cookieHeader: string,
  sessionToken: string,
): string | null {
  const targetName = `better-auth.session_token_multi-${sessionToken.toLowerCase()}`;
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    const eqIdx = cookie.indexOf("=");
    if (eqIdx === -1) continue;
    const name = cookie.substring(0, eqIdx).trim();
    if (name === targetName) {
      return cookie.substring(eqIdx + 1).trim();
    }
  }
  return null;
}

export const sessionRoute = new Elysia()
  .get("/api/session/get-active", async () => {
    throw new Error("Not implemented");
  })
  .post(
    "/api/session/set-active",
    async ({ body, request }) => {
      const headers = new Headers(request.headers);
      const existingCookies = headers.get("cookie") ?? "";

      const hasActiveSession = existingCookies.includes(
        "better-auth.session_token=",
      );

      if (!hasActiveSession) {
        const signedValue = extractMultiSessionCookieValue(
          existingCookies,
          body.sessionToken,
        );
        if (signedValue) {
          headers.set(
            "cookie",
            `${existingCookies}; better-auth.session_token=${signedValue}`,
          );
        }
      }

      return auth.api.setActiveSession({
        body: { sessionToken: body.sessionToken },
        headers,
        asResponse: true,
      });
    },
    {
      body: t.Object({
        sessionToken: t.String(),
      }),
      detail: {
        summary: "Set Active Session",
        description:
          "Sets the active session for multi-session support. Works around upstream bug where setActive requires an active session even when valid multi-session cookies exist.",
        tags: ["Authentication"],
      },
    },
  );
