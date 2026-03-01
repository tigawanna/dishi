import { hc } from "hono/client";
import app from "@api/index";
import { envVariables } from "../env";

export const honoClient = hc<typeof app>(envVariables.VITE_API_URL, {
  init: {
    credentials: "include",
  },
});



