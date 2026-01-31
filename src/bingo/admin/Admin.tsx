import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/bingo/home", { replace: true });
    }
  }, []);
  return <div>Admin</div>;
};

export default Admin;
