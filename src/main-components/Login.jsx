import { Form, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const { authLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await authLogin({ email, password });
    } catch (error) {
      //Show error for wrong username and password on the form
      console.error(`Error: ${error}`);
    }
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center">
      <div className="d-flex flex-column w-50 h-25 border p-2">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email: </Form.Label>
            <Form.Control type="email" name="email" autoComplete="true" />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password: </Form.Label>
            <Form.Control type="password" name="password" autoComplete="true" />
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
