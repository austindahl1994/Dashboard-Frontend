import React from "react";
import Board from "./Board";
import { Container, Row } from "react-bootstrap";
import "./boardPage.css";

const BoardPage = () => {
  return (
    <Container>
      <Row className="overflow-hidden">
        <h1 className="text-center team-text">Team "Cabbage Fanatics" Board</h1>
      </Row>
      <Row className="d-flex justify-content-center board-wrapper">
        <Board />
      </Row>
    </Container>
  );
};

export default BoardPage;
