import { User } from "src/types";
import { API_URL } from "src/utils/constants";
import {
  SIGN_UP_MUTATION,
  SIGN_IN_MUTATION,
  USERS_MUTATION,
} from "./constants";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

const createUser = async (user: User) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      ...user,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
};

export const useCreateUser = (): UseMutationResult<void, Error, User> => {
  return useMutation({
    mutationFn: createUser,
    mutationKey: [USERS_MUTATION, SIGN_UP_MUTATION],
  });
};

const signIn = async (payload: { login: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
};

export const useSignIn = (): UseMutationResult<
  void,
  Error,
  { login: string; password: string }
> => {
  return useMutation({
    mutationFn: signIn,
    mutationKey: [USERS_MUTATION, SIGN_IN_MUTATION],
  });
};
