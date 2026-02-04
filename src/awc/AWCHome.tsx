import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AWCHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <h1>AWC Home</h1>
      <p>Temp AWC homepage until I decide what else to add</p>
      <Button onClick={() => navigate("/")}>Back to Home</Button>
    </div>
  );
};

export default AWCHome;
