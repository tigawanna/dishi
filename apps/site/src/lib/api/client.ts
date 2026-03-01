import { hc } from "hono/client";
import app from "@api/index";
import { envVariables } from "../env";

const baseUrl = envVariables.VITE_API_URL;

export const honoClient = hc<typeof app>(baseUrl, {
  init: {
    credentials: "include",
  },
});

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  status: "success" | "error";
}

export interface ApiError {
  message: string;
  code?: string;
}
