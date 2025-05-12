import { createContext } from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { getSession, login, logout } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cachedUser = queryClient.getQueryData(["User"]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    retry: false,
    onSuccess: (data) => {
      //console.log(data.username);
      queryClient.setQueryData(["User"], data);
      navigate("./dashboard", { replace: true });
    },
    onError: () => {
      console.log(`There was an error logging user in`);
      queryClient.clear();
      throw new Error("Error logging user in");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("./login");
    },
  });

  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["User"],
    queryFn: getSession,
    retry: false,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    enabled: !cachedUser,
    initialData: cachedUser,
  });

  const authLogin = (credentials) => {
    loginMutation.mutate(credentials);
  };

  const authLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        authLogin,
        authLogout,
        user,
        isError,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
