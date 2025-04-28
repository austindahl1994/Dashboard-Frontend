import { createContext, useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { getSession, login, logout } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => login(email, password),
    retry: false,
    onSuccess: (data) => {
      //console.log(data.username);
      setUser(data);
      navigate("./dashboard", { replace: true });
    },
    onError: () => {
      console.log(`There was an error logging user in`);
      setUser({});
      navigate("./login");
      throw new Error("Error logging user in");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      setUser({});
      navigate("./login");
    },
  });

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
    retry: false,
    staleTime: Infinity,
    refetchInterval: 3600000,
    refetchOnWindowFocus: false,
  });

  // handle success
  useEffect(() => {
    if (sessionQuery.isSuccess && Object.keys(user).length === 0) {
      console.log("Successfully checked session");
      setUser(sessionQuery.data);
      navigate(location || "./dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionQuery.isSuccess]);

  // handle error
  useEffect(() => {
    if (sessionQuery.isError) {
      setUser({});
      navigate("./login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionQuery.isError]);


  const authLogin = (credentials) => {
    loginMutation.mutate(credentials);
  };

  const authLogout = () => {
    logoutMutation.mutate();
  };

  const checkSession = () => {
    sessionQuery.refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        authLogin,
        authLogout,
        checkSession,
        isCheckingSession: sessionQuery.isFetching,
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
