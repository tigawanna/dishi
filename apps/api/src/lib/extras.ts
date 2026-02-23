import { z } from "zod";

//  role: "admin" | "member" | "owner" | ("admin" | "member" | "owner")[]
export const adminRoleSchema = z.union([
  z.literal("owner"),
  z.literal("manager"),
  z.literal("staff"),
  z.array(z.enum(["owner", "manager", "staff"])),
]);
