import * as authSchema from "./auth-schema.js";
export * from "./dishi-schema.js";

import { dishiRelations } from "./relations.js";

export const relations = {
  ...dishiRelations,
  ...authSchema.relations,
};
