import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Container, Nav } from "react-bootstrap";

const AWC: React.FC = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 16 }}>
        <h2>AWC</h2>
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link as={Link} to="">
              Home
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="labels">
              Labels
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div style={{ flex: 1, padding: 16, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AWC;
