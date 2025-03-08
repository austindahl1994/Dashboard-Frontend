import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Nav defaultActiveKey="/dashboard" className="flex-column">
      <Nav.Link as={Link} to="/dashboard">
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/dashboard/characterGeneration">
        Character Generation
      </Nav.Link>
    </Nav>
  );
};

export default Navbar;
