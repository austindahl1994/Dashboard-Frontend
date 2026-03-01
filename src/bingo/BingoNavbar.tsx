import { Button, Container, Image, Nav, Navbar, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./bingoNav.css";

function BingoNavbar() {
  const [hasPasscode, setHasPasscode] = useState<boolean>(
    () => !!localStorage.getItem("passcode"),
  );

  const [isAdmin, setIsAdmin] = useState<boolean>(
    () => localStorage.getItem("isAdmin") === "true",
  );
  const [team, setTeam] = useState<string | null>(() =>
    localStorage.getItem("team"),
  );

  const [checkSwitch, setCheckSwitch] = useState<boolean>(
    () => localStorage.getItem("bingo_check") === "true",
  );
  const [raveSwitch, setRaveSwitch] = useState<boolean>(
    () => localStorage.getItem("bingo_rave") === "true",
  );
  const [hoverSwitch, setHoverSwitch] = useState<boolean>(
    () => localStorage.getItem("bingo_hover") === "true",
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "passcode") setHasPasscode(!!e.newValue);
      if (e.key === "isAdmin") setIsAdmin(e.newValue === "true");
      if (e.key === "team") setTeam(e.newValue);
    };
    const onTeamChanged = (e: Event) => {
      try {
        const custom = e as CustomEvent;
        const incoming = custom?.detail?.team ?? localStorage.getItem("team");
        setTeam(incoming ?? null);
      } catch (err) {
        setTeam(localStorage.getItem("team"));
      }
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
    const onIsAdminChanged = (e: Event) => {
      try {
        const custom = e as CustomEvent;
        const val = custom?.detail?.isAdmin ?? localStorage.getItem("isAdmin");
        setIsAdmin(val === true || val === "true");
      } catch (err) {
        setIsAdmin(localStorage.getItem("isAdmin") === "true");
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(
      "passcodeChanged",
      onPasscodeChanged as EventListener,
    );
    window.addEventListener(
      "isAdminChanged",
      onIsAdminChanged as EventListener,
    );
    window.addEventListener("teamChanged", onTeamChanged as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(
        "passcodeChanged",
        onPasscodeChanged as EventListener,
      );
      window.removeEventListener(
        "isAdminChanged",
        onIsAdminChanged as EventListener,
      );
      window.removeEventListener("teamChanged", onTeamChanged as EventListener);
    };
  }, []);

  const handleReset = () => {
    try {
      localStorage.removeItem("passcode");
      localStorage.removeItem("board");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("team");
      setHasPasscode(false);
      setIsAdmin(false);
      setTeam(null);
      try {
        window.dispatchEvent(
          new CustomEvent("passcodeChanged", { detail: { passcode: null } }),
        );
        window.dispatchEvent(
          new CustomEvent("isAdminChanged", { detail: { isAdmin: null } }),
        );
        window.dispatchEvent(
          new CustomEvent("teamChanged", { detail: { team: null } }),
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

  const getTeam = (teamNum: number): string => {
    switch (teamNum) {
      case 1:
        return "Team <3";
      case 2:
        return "Team 3";
      case 3:
        return "Team :3";
      default:
        return teamNum.toString();
    }
  };

  const getColor = (teamNum: number): string => {
    switch (teamNum) {
      case 1:
        return "chartreuse"; //chartreuse color
      case 2:
        return "fuchsia";
      case 3:
        return "green";
      default:
        return "black";
    }
  };

  return (
    <div className="bingo-nav">
      <Nav className="d-flex h-100 m-0 p-0">
        <Container fluid className="d-flex flex-column h-100">
          <div>
            <Navbar.Brand as={Link} to="/bingo">
              <Image
                src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/VinnyLogo.png"
                fluid
                roundedCircle
                style={{ padding: "1em" }}
              />
            </Navbar.Brand>
            {isAdmin && (
              <Nav.Link as={Link} to="/bingo/admin">
                <h3 style={{ color: "red" }}>Admin</h3>
              </Nav.Link>
            )}
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
                <Nav.Link as={Link} to="/bingo/scores">
                  Highscores
                </Nav.Link>
                <Nav.Link as={Link} to="/bingo/shame">
                  Shame
                </Nav.Link>
                <Nav.Link as={Link} to="/bingo/board">
                  <h4>Board</h4>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/bingo/login">
                Login
              </Nav.Link>
            )}
          </div>
          {team && (
            <div
              style={{
                textAlign: "center",
                fontWeight: 700,
                fontFamily: "'Pirata One', serif",
                textShadow:
                  "1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000",
                color: getColor(Number(team)),
              }}
            >
              <h1 className="nav-text">{getTeam(Number(team))}</h1>
            </div>
          )}
          {team && hasPasscode && (
            <div className="d-flex flex-column align-items-center mb-3 gap-3 px-2">
              <div className="d-flex align-items-center">
                <span className="me-2">Check</span>
                <Form>
                  <Form.Check
                    type="switch"
                    id="check-switch"
                    label={""}
                    checked={checkSwitch}
                    onChange={(e) => {
                      const v = e.currentTarget.checked;
                      setCheckSwitch(v);
                      try {
                        localStorage.setItem(
                          "bingo_check",
                          v ? "true" : "false",
                        );
                        window.dispatchEvent(
                          new CustomEvent("bingoCheckChanged", {
                            detail: { value: v },
                          }),
                        );
                      } catch (err) {
                        /* ignore */
                      }
                    }}
                  />
                </Form>
              </div>

              <div className="d-flex align-items-center">
                <span className="me-2">Rave</span>
                <Form>
                  <Form.Check
                    type="switch"
                    id="rave-switch"
                    label={""}
                    checked={raveSwitch}
                    onChange={(e) => {
                      const v = e.currentTarget.checked;
                      setRaveSwitch(v);
                      try {
                        localStorage.setItem(
                          "bingo_rave",
                          v ? "true" : "false",
                        );
                        window.dispatchEvent(
                          new CustomEvent("bingoRaveChanged", {
                            detail: { value: v },
                          }),
                        );
                      } catch (err) {
                        /* ignore */
                      }
                    }}
                  />
                </Form>
              </div>

              <div className="d-flex align-items-center">
                <span className="me-2">Hover</span>
                <Form>
                  <Form.Check
                    type="switch"
                    id="hover-switch"
                    label={""}
                    checked={hoverSwitch}
                    onChange={(e) => {
                      const v = e.currentTarget.checked;
                      setHoverSwitch(v);
                      try {
                        localStorage.setItem(
                          "bingo_hover",
                          v ? "true" : "false",
                        );
                        window.dispatchEvent(
                          new CustomEvent("bingoHoverChanged", {
                            detail: { value: v },
                          }),
                        );
                      } catch (err) {
                        /* ignore */
                      }
                    }}
                  />
                </Form>
              </div>
            </div>
          )}
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
