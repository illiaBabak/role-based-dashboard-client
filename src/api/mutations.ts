import { AuthResponse, User } from "src/types";
import { API_URL } from "src/utils/constants";
import {
  SIGN_UP_MUTATION,
  SIGN_IN_MUTATION,
  USERS_MUTATION,
} from "./constants";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
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

export const useSignIn = (): UseMutationResult<
  AuthResponse | null,
  Error,
  { login: string; password: string }
> => {
  return useMutation({
    mutationFn: signIn,
    mutationKey: [USERS_MUTATION, SIGN_IN_MUTATION],
  });
};
