import { auth } from "@backend/lib/auth";
import { Elysia } from "elysia";

export const viewerRoute = new Elysia().get(
  "/viewer",
  async ({ request, set }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    console.log("========= viewerRoute - session:", request.headers);

    if (!session) {
      set.status = 401;
      return { error: "Unauthorized", user: null, session: null };
    }

    return {
      user: session.user,
      session: session.session,
    };
  },
  {
    detail: {
      summary: "Get Current Viewer",
      description: "Returns the currently authenticated user and session",
      tags: ["User"],
    },
  },
);
