import { extractFieldErrors } from "@backend/utils/elysia-validation-errors";
import { Elysia, status } from "elysia";
import z from "zod";

// not bieng used i the handler for now
export const onErrorMiddleware = new Elysia().onError(({ error, code }) => {
  switch (code) {
    case "UNKNOWN":
      return status(500, {
        result: null,
        error: {
          code,
          name: error.name,
          message: error.message || "Unknown error occurred",
          stack: error.stack,
          cause: error?.cause,
        },
      });
    case "VALIDATION":
      return status(400, {
        result: null,
        error: {
          code,
          name: error.name,
          message: error.message || "Validation error occurred",
          stack: error.stack,
          cause: error?.cause,
          fieldsErrors: extractFieldErrors(error),
        },
      });
    default:
      return status("status" in error ? error.status || 500 : 500, {
        result: null,
        error: {
          code,
          name: "name" in error ? error.name : "Unknown",
          message: "message" in error ? error.message || "An error occurred" : "An error occurred",
          stack: "stack" in error ? error.stack : undefined,
          cause: "cause" in error ? error.cause : undefined,
        },
      });
  }
});

const errorrCodeSchema = z.enum([
  "UNKNOWN",
  "VALIDATION",
  "BAD_REQUEST",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "INTERNAL_SERVER_ERROR",
]);

// Base error shape shared by all error variants
export const baseErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
  stack: z.string().optional(),
  cause: z.any().optional(),
});

// Validation-specific error: must include fieldsErrors
export const validationErrorSchema = baseErrorSchema.extend({
  code: z.literal("VALIDATION"),
  fieldsErrors: z.record(z.string(), z.array(z.string())),
});

// Generic error variants for non-validation codes
export const genericErrorSchema = baseErrorSchema.extend({
  code: z.union([
    z.literal("UNKNOWN"),
    z.literal("BAD_REQUEST"),
    z.literal("UNAUTHORIZED"),
    z.literal("FORBIDDEN"),
    z.literal("NOT_FOUND"),
    z.literal("INTERNAL_SERVER_ERROR"),
  ]),
});

// Discriminated union: `fieldsErrors` only exists on the VALIDATION branch
export const errorSchema = z.discriminatedUnion("code", [
  validationErrorSchema,
  genericErrorSchema,
]);

export type ErrorSchema = z.infer<typeof errorSchema>;
