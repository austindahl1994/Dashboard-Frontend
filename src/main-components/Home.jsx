import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Welcome to DahlDash.com!</h1>
      <Button onClick={() => navigate("/login")}>Login</Button>
    </div>
  );
};

export default Home;
