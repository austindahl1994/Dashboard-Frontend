import { useContext } from "react";
import { AuthContext } from "../main-components/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
