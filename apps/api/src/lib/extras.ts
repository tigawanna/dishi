import { z } from "zod";

export const orgRoleSchema = z.union([
  z.literal("owner"),
  z.literal("staff"),
  z.array(z.enum(["owner", "staff"])),
]);
