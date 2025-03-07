import { Form, Button } from "react-bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { checkSession } from '../api.js';
//import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated, setUser, authLogin } =
    useContext(AuthContext);
  const isCheckingRef = useRef(false);
  const navigate = useNavigate();
  //const navigate = useNavigate()
useEffect(() => {
  const authCheck = async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const response = await checkSession();
      if (response?.data.message === "Authenticated") {
        console.log("User is authenticated");
        setIsAuthenticated(true);
        setUser(response.user);
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Invalid session");
      }
    } catch (e) {
      console.log(e.message);
      setIsAuthenticated(false);
      setUser({});
      navigate("/login", { replace: true });
    } finally {
      isCheckingRef.current = false;
    }
  };

  authCheck();
}, [navigate, setIsAuthenticated, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authLogin(email, password)
    } catch (error) {
      //Show error for wrong username and password on the form
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
    </div>
  );
};
//      <Button onClick={checkForSession}>Check Session</Button>
export default Login;
