import { useGetUser } from "src/api/queries";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { data: authResponse, isLoading, error } = useGetUser();

  const navigate = useNavigate();

  const user = authResponse?.data.user;

  useEffect(() => {
    if (isLoading) return;

    if (!user || error) navigate("/");
  }, [error, isLoading, navigate, user]);

  return { user, isLoading };
};
