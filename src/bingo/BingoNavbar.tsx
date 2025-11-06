import { Button, Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./bingoNav.css";

function BingoNavbar() {
  return (
    <div>
      <Nav className="d-flex h-100 m-0 p-0">
        <Container fluid>
          <Navbar.Brand as={Link} to="/bingo">
            <Image
              src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/VinnyLogo.png"
              fluid
            />
          </Navbar.Brand>
          <Nav.Link as={Link} to="/bingo">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/bingo/rules">
            Rules
          </Nav.Link>
          <Nav.Link as={Link} to="/bingo/setup">
            Setup
          </Nav.Link>
          <Nav.Link as={Link} to="/bingo/board">
            Board
          </Nav.Link>
        </Container>
      </Nav>
    </div>
  );
}

export default BingoNavbar;
