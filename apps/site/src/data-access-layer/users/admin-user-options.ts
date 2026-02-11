import { authClient, BetterAuthUserRoles } from "@/lib/better-auth/client";
import { unwrapUnknownError } from "@/utils/errors";
import { mutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

type FormValues = {
  name: string;
  email: string;
  password?: string;
  role?: BetterAuthUserRoles;
  orgId?: string | undefined;
};

export type TCreateUserPayload = Omit<Parameters<typeof authClient.admin.createUser>[0], "role"> & {
  role?: BetterAuthUserRoles;
};

export const createUserMutationOptions = mutationOptions({
  mutationFn: async (payload: TCreateUserPayload) => {
    const { data, error } = await authClient.admin.createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password!,
      role: payload.role as Parameters<typeof authClient.admin.createUser>[0]["role"],
    });
    if (error) throw error;
    return data;
  },
  onSuccess() {
    toast.success("User created");
  },
  onError(err: unknown) {
    toast.error("Failed to create user", {
      description: unwrapUnknownError(err).message,
    });
  },
  meta: {
    invalidates: [["users"]],
  },
});

type TUpdateUserPayload = Parameters<typeof authClient.admin.updateUser>[0] & {
  data: Partial<FormValues>;
};

export const updateUserMutationOptions = mutationOptions({
  mutationFn: async (payload: TUpdateUserPayload) => {
    const { data, error } = await authClient.admin.updateUser({
      data: payload.data,
      userId: payload.userId,
      fetchOptions: payload.fetchOptions,
    });
    if (error) throw error;
    return data;
  },
  onError(err: unknown) {
    toast.error("Failed to update user", {
      description: unwrapUnknownError(err).message,
    });
  },
  meta: {
    invalidates: [["users"]],
  },
});

type TAddUserToOrgPayload = Parameters<typeof authClient.organization.inviteMember>[0];

export const addUserToOrgMutationOptions = mutationOptions({
  mutationFn: async (payload: TAddUserToOrgPayload) => {
    const { data, error } = await authClient.organization.inviteMember({
      email: payload.email,
      role: payload.role,
      organizationId: payload.organizationId,
      fetchOptions: payload.fetchOptions,
    });
    if (error) throw error;
    return data;
  },
  onError() {
    toast.error("Failed to add user to organization");
  },
  meta: {
    invalidates: [["organizations", "members"]],
  },
});

export type TSetRolePayload = {
  userId: string;
  role: BetterAuthUserRoles | BetterAuthUserRoles[];
};

export const setUserRoleMutationOptions = mutationOptions({
  mutationFn: async (payload: TSetRolePayload) => {
    const { data, error } = await authClient.admin.setRole(
      payload as unknown as Parameters<typeof authClient.admin.setRole>[0],
    );
    if (error) throw error;
    return data;
  },
  onError() {
    toast.error("Failed to set user role");
  },
  meta: {
    invalidates: [["users"], ["organizations", "members"]],
  },
});

type TBanUserPayload = Parameters<typeof authClient.admin.banUser>[0];

export const banUserMutationOptions = mutationOptions({
  mutationFn: async (payload: TBanUserPayload) => {
    if (typeof authClient.admin.banUser === "function") {
      const { data, error } = await authClient.admin.banUser(payload);
      if (error) throw error;
      return data;
    }
    throw new Error("banUser not available");
  },
  onSuccess() {
    toast.success("User banned");
  },
  onError(err: unknown) {
    toast.error("Failed to ban user", {
      description: unwrapUnknownError(err).message,
    });
  },
  meta: {
    invalidates: [["users"]],
  },
});

type TUnbanUserPayload = Parameters<typeof authClient.admin.unbanUser>[0];

export const unbanUserMutationOptions = mutationOptions({
  mutationFn: async (payload: TUnbanUserPayload) => {
    const { data, error } = await authClient.admin.unbanUser(payload);
    if (error) throw error;
    return data;
  },
  onSuccess() {
    toast.success("User unbanned");
  },
  onError(err: unknown) {
    toast.error("Failed to unban user", {
      description: unwrapUnknownError(err).message,
    });
  },
  meta: {
    invalidates: [["users"]],
  },
});

type TRemoveUserPayload = Parameters<typeof authClient.admin.removeUser>[0];

export const removeUserMutationOptions = mutationOptions({
  mutationFn: async (payload: TRemoveUserPayload) => {
    const { data, error } = await authClient.admin.removeUser(payload);
    if (error) throw error;
    return data;
  },
  onSuccess() {
    toast.success("User removed");
  },
  onError(err: unknown) {
    toast.error("Failed to remove user", {
      description: unwrapUnknownError(err).message,
    });
  },
  meta: {
    invalidates: [["users"]],
  },
});
