import { defineRelations } from "drizzle-orm";
import * as schema from "./schema/index.js";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    apikeys: r.many.apikey(),
    members: r.many.member(),
    invitations: r.many.invitation({
      from: r.invitation.inviterId,
      to: r.user.id,
    }),
    favorites: r.many.customerFavorite(),
    locations: r.many.customerLocation(),
  },

  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },

  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },

  apikey: {
    user: r.one.user({
      from: r.apikey.userId,
      to: r.user.id,
    }),
  },

  organization: {
    members: r.many.member(),
    invitations: r.many.invitation(),
    kitchenProfile: r.one.kitchenProfile({
      from: r.organization.id,
      to: r.kitchenProfile.organizationId,
    }),
  },

  member: {
    organization: r.one.organization({
      from: r.member.organizationId,
      to: r.organization.id,
    }),
    user: r.one.user({
      from: r.member.userId,
      to: r.user.id,
    }),
  },

  invitation: {
    organization: r.one.organization({
      from: r.invitation.organizationId,
      to: r.organization.id,
    }),
    inviter: r.one.user({
      from: r.invitation.inviterId,
      to: r.user.id,
    }),
  },

  kitchenProfile: {
    organization: r.one.organization({
      from: r.kitchenProfile.organizationId,
      to: r.organization.id,
    }),
    cuisines: r.many.cuisineType({
      from: r.kitchenProfile.id.through(r.kitchenCuisine.kitchenId),
      to: r.cuisineType.id.through(r.kitchenCuisine.cuisineId),
    }),
    menuCategories: r.many.menuCategory(),
    menuItems: r.many.menuItem(),
    favorites: r.many.customerFavorite(),
  },

  cuisineType: {
    kitchens: r.many.kitchenProfile({
      from: r.cuisineType.id.through(r.kitchenCuisine.cuisineId),
      to: r.kitchenProfile.id.through(r.kitchenCuisine.kitchenId),
    }),
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
