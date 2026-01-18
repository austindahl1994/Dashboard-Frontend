import { Button, Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./bingoNav.css";

function BingoNavbar() {
  const [hasPasscode, setHasPasscode] = useState<boolean>(
    () => !!localStorage.getItem("passcode"),
  );

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "passcode") setHasPasscode(!!e.newValue);
    };
    const onPasscodeChanged = (e: Event) => {
      try {
        // CustomEvent with detail from Login
        const custom = e as CustomEvent;
        const pass =
          custom?.detail?.passcode ?? localStorage.getItem("passcode");
        setHasPasscode(!!pass);
      } catch (err) {
        setHasPasscode(!!localStorage.getItem("passcode"));
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "passcodeChanged",
      onPasscodeChanged as EventListener,
    );
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleReset = () => {
    try {
      localStorage.removeItem("passcode");
      localStorage.removeItem("board");
      setHasPasscode(false);
      try {
        window.dispatchEvent(
          new CustomEvent("passcodeChanged", { detail: { passcode: null } }),
        );
      } catch (err) {
        /* ignore */
        console.log("Error resetting cached data:", err);
      }
    } catch (err) {
      console.error("Failed to clear passcode/board from localStorage:", err);
    }
  };
  const navigate = useNavigate();
  const handleResetNavigate = () => {
    handleReset();
    navigate("/bingo");
  };

  return (
    <div>
      <Nav className="d-flex h-100 m-0 p-0">
        <Container fluid className="d-flex flex-column h-100">
          <div>
            <Navbar.Brand as={Link} to="/bingo">
              <Image
                src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/VinnyLogo.png"
                fluid
                style={{ padding: "1em" }}
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
            {hasPasscode ? (
              <>
                <Nav.Link as={Link} to="/bingo/board">
                  Board
                </Nav.Link>
                <Nav.Link as={Link} to="/bingo/scores">
                  Highscores
                </Nav.Link>
                <Nav.Link as={Link} to="/bingo/shame">
                  Shame
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/bingo/login">
                Login
              </Nav.Link>
            )}
          </div>

          {hasPasscode && (
            <div className="mt-auto d-flex justify-content-center">
              <Button
                variant="danger"
                onClick={handleResetNavigate}
                className="mb-3"
              >
                Logout
              </Button>
            </div>
          )}
        </Container>
      </Nav>
    </div>
  );
}

export default BingoNavbar;
