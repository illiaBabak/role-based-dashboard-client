import { AuthResponse, CreatedUser } from "src/types";
import { API_URL } from "src/utils/constants";
import { isAuthResponse, isUsersResponse } from "src/utils/guards";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { GET_USER_QUERY, USERS_QUERY } from "./constants";

const getUser = async (): Promise<AuthResponse | null> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  return isAuthResponse(result) ? result : null;
};

const getUsers = async (): Promise<CreatedUser[] | null> => {
  const response = await fetch(`${API_URL}/users`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return isUsersResponse(result) ? result.data.users : null;
};

export const useGetUser = (): UseQueryResult<AuthResponse | null, Error> => {
  return useQuery({
    queryKey: [GET_USER_QUERY],
    queryFn: getUser,
  });
};

export const useGetUsers = (): UseQueryResult<CreatedUser[] | null, Error> => {
  return useQuery({
    queryKey: [USERS_QUERY],
    queryFn: getUsers,
  });
};
