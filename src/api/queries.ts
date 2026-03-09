import { AuthResponse } from "src/types";
import { API_URL } from "src/utils/constants";
import { isAuthResponse } from "src/utils/guards";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { GET_USER_QUERY } from "./constants";

const getUser = async (): Promise<AuthResponse | null> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }
  console.log(result);
  return isAuthResponse(result) ? result : null;
};

export const useGetUser = (): UseQueryResult<AuthResponse | null, Error> => {
  return useQuery({
    queryKey: [GET_USER_QUERY],
    queryFn: getUser,
  });
};
