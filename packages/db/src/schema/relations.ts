import { defineRelations } from "drizzle-orm";
import * as auth from "./auth-schema.js";
import * as dishi from "./dishi-schema.js";

const schema = { ...auth, ...dishi };

export const dishiRelations = defineRelations(schema, (r) => ({
  cuisineType: {
    kitchens: r.many.kitchenCuisine(),
  },
  kitchenProfile: {
    organization: r.one.organization({
      from: r.kitchenProfile.organizationId,
      to: r.organization.id,
    }),
    cuisines: r.many.kitchenCuisine(),
    menuCategories: r.many.menuCategory(),
    menuItems: r.many.menuItem(),
    favorites: r.many.customerFavorite(),
  },
  kitchenCuisine: {
    kitchen: r.one.kitchenProfile({
      from: r.kitchenCuisine.kitchenId,
      to: r.kitchenProfile.id,
    }),
    cuisine: r.one.cuisineType({
      from: r.kitchenCuisine.cuisineId,
      to: r.cuisineType.id,
    }),
  },
  menuCategory: {
    kitchen: r.one.kitchenProfile({
      from: r.menuCategory.kitchenId,
      to: r.kitchenProfile.id,
    }),
    items: r.many.menuItem(),
  },
  menuItem: {
    kitchen: r.one.kitchenProfile({
      from: r.menuItem.kitchenId,
      to: r.kitchenProfile.id,
    }),
    category: r.one.menuCategory({
      from: r.menuItem.categoryId,
      to: r.menuCategory.id,
    }),
  },
  customerFavorite: {
    user: r.one.user({
      from: r.customerFavorite.userId,
      to: r.user.id,
    }),
    kitchen: r.one.kitchenProfile({
      from: r.customerFavorite.kitchenId,
      to: r.kitchenProfile.id,
    }),
  },
  customerLocation: {
    user: r.one.user({
      from: r.customerLocation.userId,
      to: r.user.id,
    }),
  },
}));
