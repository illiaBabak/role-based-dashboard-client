import { AuthResponse, CreatedUser, UpdateUserPayload, User } from "src/types";
import { API_URL } from "src/utils/constants";
import {
  SIGN_UP_MUTATION,
  SIGN_IN_MUTATION,
  USERS_MUTATION,
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  LOGOUT_MUTATION,
  GET_USER_QUERY,
  USERS_QUERY,
} from "./constants";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { isAuthResponse } from "src/utils/guards";

const createUser = async (user: User): Promise<AuthResponse | null> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...user,
    }),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return isAuthResponse(result) ? result : null;
};

const signIn = async (payload: {
  login: string;
  password: string;
}): Promise<AuthResponse | null> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return isAuthResponse(result) ? result : null;
};

const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }
};

const updateUser = async ({
  id,
  ...payload
}: UpdateUserPayload): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }
};

const deleteUser = async (userId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }
};

export const useCreateUser = (): UseMutationResult<
  AuthResponse | null,
  Error,
  User
> => {
  return useMutation({
    mutationFn: createUser,
    mutationKey: [USERS_MUTATION, SIGN_UP_MUTATION],
  });
};

export const useSignIn = (): UseMutationResult<
  AuthResponse | null,
  Error,
  { login: string; password: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    mutationKey: [USERS_MUTATION, SIGN_IN_MUTATION],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GET_USER_QUERY] });
    },
  });
};

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    mutationKey: [USERS_MUTATION, LOGOUT_MUTATION],
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [GET_USER_QUERY] });
    },
  });
};

export const useDeleteUser = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    mutationKey: [USERS_MUTATION, DELETE_USER_MUTATION],
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY] });

      const previousUsers = queryClient.getQueryData<CreatedUser[]>([
        USERS_QUERY,
      ]);

      queryClient.setQueryData(
        [USERS_QUERY],
        (prev: CreatedUser[] | undefined) => {
          return prev?.filter((user) => user.id !== userId);
        }
      );

      return { previousUsers };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY] });
    },
  });
};

export const useUpdateUser = (): UseMutationResult<
  void,
  Error,
  UpdateUserPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    mutationKey: [USERS_MUTATION, UPDATE_USER_MUTATION],
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY] });

      const previousUsers = queryClient.getQueryData<CreatedUser[]>([
        USERS_QUERY,
      ]);

      queryClient.setQueryData(
        [USERS_QUERY],
        (prev: CreatedUser[] | undefined) => {
          return prev?.map((user) => {
            if (user.id === payload.id) {
              return { ...user, ...payload };
            }
            return user;
          });
        }
      );

      return { previousUsers };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY] });
    },
  });
};
