import { auth } from "@backend/lib/auth";
import { Elysia, t } from "elysia";

export const sessionRoute = new Elysia()
.get("/api/session/get-active", async ({ request }) => {
  throw new Error("Not implemented");
}, )
.post(
  "/api/session/set-active",
  async ({ body, request }) => {
    console.log("========= sessionRoute - body:", body);
    
    try{
      return await auth.api.setActiveSession({
        body: { sessionToken: body.sessionToken },
        headers: request.headers,
        asResponse: true,
      });
    }
      catch(error){
        console.error("========= sessionRoute - error:", error);
        return { error: "Internal Server Error" };
      }
    // return auth.api.setActiveSession({
    //   body: { sessionToken: body.sessionToken },
    //   headers: request.headers,
    //   asResponse: true,
    // });
  },
  {
    body: t.Object({
      sessionToken: t.String(),
    }),
    detail: {
      summary: "Set Active Session",
      description: "Sets the active session for multi-session support",
      tags: ["Authentication"],
    },
  },
);
