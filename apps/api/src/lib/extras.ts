import { z } from "zod";

//  role: "admin" | "member" | "owner" | ("admin" | "member" | "owner")[]
export const adminRoleSchema = z.union([
  z.literal("admin"),
  z.literal("member"),
  z.literal("owner"),
  z.array(z.enum(["admin", "member", "owner"])),
]);
