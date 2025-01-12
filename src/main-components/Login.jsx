import { Form, Button } from "react-bootstrap";
import { login, logout } from "./authApi";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authLogin, authLogout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authLogin(email, password)
    } catch (error) {
      //Show error for wrong username and password on the form
    }
  };
  //still show a confirmation that user has logged out though
  const handleLogout = () => { //wont be needed since logout button not here
    authLogout()
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
    </div>
  );
};
//      <Button onClick={checkForSession}>Check Session</Button>
export default Login;
