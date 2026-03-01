import { envVariables } from "@elysia-api/env";

export const AUTHORIZED_ORIGINS = [envVariables.FRONTEND_URL ?? ""];
