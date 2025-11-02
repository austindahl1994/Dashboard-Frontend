import { Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./bingoNav.css";

function BingoNavbar() {
  return (
    <div>
      <Nav className="flex-column justify-content-center align-items-center p-1 Bingo-Nav">
        <Container fluid>
          <Navbar.Brand as={Link} to="/bingo">
            <Image
              src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/VinnyLogo.png"
              fluid
            />
          </Navbar.Brand>
        </Container>
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
      </Nav>
    </div>
  );
}

export default BingoNavbar;
