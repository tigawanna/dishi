/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(
  config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV === "test" ? ".env.test" : ".env"),
  }),
);

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  DATABASE_URL: z.string().url().optional(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  REDIS_PORT: z.string().optional(),
  CRUD_BEARER_TOKEN: z.string().optional(),
  API_URL: z.string().optional(),
  FRONTEND_URL: z.string().optional(),
  ACCESS_TOKEN_SECRET: z.string().optional(),
  REFRESH_TOKEN_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_USER: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});
// .superRefine((input, ctx) => {
//   if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.invalid_type,
//       expected: "string",
//       received: "undefined",
//       path: ["DATABASE_AUTH_TOKEN"],
//       message: "Must be set when NODE_ENV is 'production'",
//     });
//   }
// });

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

const envVariables = env!;
export { envVariables };

export const isProductionEnv = envVariables.NODE_ENV === "production";
