import { Button, Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import '../main-styles/navbar.css'
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { authLogout } = useAuth();

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  return (
    <div>
      {!show ? (
        <div className="showNav">
          <GoSidebarCollapse size={25} onClick={handleOpen} />
        </div>
      ) : (
        <Offcanvas show={show} className="customNav" autoFocus>
          <Offcanvas.Header className="customHeader">
            <Nav>
              <Nav.Link as={Link} onClick={handleClose} to="/dashboard">
                Dashboard Home
              </Nav.Link>
            </Nav>
            <GoSidebarExpand size={25} onClick={handleClose} />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex h-100 flex-column justify-content-between">
              <Nav className="d-flex flex-column">
                <Nav.Link
                  as={Link}
                  onClick={handleClose}
                  to="/dashboard/characterGeneration"
                >
                  Character Generation
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  onClick={handleClose}
                  to="/dashboard/expensetracker"
                >
                  Expense Tracker
                </Nav.Link>
              </Nav>
              <Button onClick={authLogout}>Logout</Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default Navbar;
