import { auth } from "@elysia-api/lib/auth";
import { Elysia, t } from "elysia";

// WORKAROUND: better-auth multi-session plugin bug
// setActive requires sessionMiddleware (a valid better-auth.session_token),
// but a legitimate flow exists where the user has no active session and only
// _multi- cookies remain (e.g. active session expired). listDeviceSessions
// works (no sessionMiddleware), but setActive 401s.
// We derive better-auth.session_token from the _multi- signed cookie to
// satisfy sessionMiddleware. Both are signed with the same server secret.
// See: https://github.com/better-auth/better-auth/issues/XXXX

function extractMultiSessionCookieValue(
  cookieHeader: string,
  sessionToken: string,
): string | null {
  const targetName = `better-auth.session_token_multi-${sessionToken.toLowerCase()}`;
  for (const cookie of cookieHeader.split(";")) {
    const eqIdx = cookie.indexOf("=");
    if (eqIdx === -1) continue;
    const name = cookie.substring(0, eqIdx).trim();
    if (name === targetName) {
      return cookie.substring(eqIdx + 1).trim();
    }
  }
  return null;
}

function hasMainSessionCookie(cookieHeader: string): boolean {
  for (const cookie of cookieHeader.split(";")) {
    const eqIdx = cookie.indexOf("=");
    if (eqIdx === -1) continue;
    const name = cookie.substring(0, eqIdx).trim();
    if (name === "better-auth.session_token") return true;
  }
  return false;
}

export const sessionRoute = new Elysia()
  .post(
    "/api/session/set-active",
    async ({ body, request, set }) => {
      const headers = new Headers(request.headers);
      const existingCookies = headers.get("cookie") ?? "";

      // WORKAROUND: Inject better-auth.session_token from the _multi- cookie
      // so sessionMiddleware doesn't 401 when no active session exists.
      if (!hasMainSessionCookie(existingCookies)) {
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

      const response = await auth.api.setActiveSession({
        body: { sessionToken: body.sessionToken },
        headers,
        asResponse: true,
      });

      // WORKAROUND: Elysia may not forward set-cookie headers from a raw
      // Response returned by better-auth. Explicitly propagate them so the
      // browser receives the new better-auth.session_token cookie.
      const setCookies = response.headers.getSetCookie();
      for (const cookie of setCookies) {
        set.headers["set-cookie"] = set.headers["set-cookie"]
          ? `${set.headers["set-cookie"]}, ${cookie}`
          : cookie;
      }

      set.status = response.status;
      return response.json();
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
