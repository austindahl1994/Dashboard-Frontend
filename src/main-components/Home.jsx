import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <h1>Welcome to DahlDash.com!</h1>
      <div className="d-flex gap-2 mt-3">
        <Button onClick={() => navigate("/login")}>Dashboard Login</Button>
        <Button onClick={() => navigate("/bingo")}>Bingo Home</Button>
        <Button onClick={() => navigate("/awc")}>AWC Home</Button>
      </div>
    </div>
  );
};

export default Home;
