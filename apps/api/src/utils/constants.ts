import { envVariables } from "@backend/env";

export const AUTHORIZED_ORIGINS = [envVariables.FRONTEND_URL ?? ""];
