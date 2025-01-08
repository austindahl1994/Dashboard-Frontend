import { Form, Button } from "react-bootstrap";
import { login, logout } from "./authApi";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const {checkForSession} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData) {
        console.log(
          `${userData.user_id}, ${userData.username} ${userData.email}, ${userData.role}`
        );
      }
    } catch (error) {
      console.error(`Error: ${error}`)
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response)
    } catch (error) {
      console.error(`Error: ${error}`)
    }
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column w-50 h-25 border p-2">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email: </Form.Label>
            <Form.Control
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password: </Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
          <Button className="mt-3" type="submit">
            Login
          </Button>
        </Form>
      </div>
      <Button onClick={handleLogout}>Logout</Button>
      <Button onClick={checkForSession}>Check Session</Button>
    </div>
  );
};

export default Login;
