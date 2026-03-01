import { auth } from "@elysia-api/lib/auth";
import { Elysia, t } from "elysia";

export const viewerRoute = new Elysia()
  .get(
    "/viewer",
    async ({ request, set }) => {
      const session = await auth.api.getSession({
        headers: request.headers,
      });
   
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
  )
  .post("/viewer/login", async ({ body, request }) => {
    const headers = new Headers(request.headers);
    const session = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
      headers,
    });
    console.log("========= viewerRoute - session:", session); 
    return session;
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  });
