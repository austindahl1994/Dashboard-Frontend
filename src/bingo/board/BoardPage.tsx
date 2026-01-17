import Board from "./Board";
import { Container, Row } from "react-bootstrap";
import "./boardPage.css";
// Wrapper for the board, useful for when adding dropdown for how to view the board tiles
const BoardPage = () => {
  return (
    <Container className="m-0 p-0">
      {/* <Row className="overflow-hidden">
        <h1 className="text-center team-text">Team "Cabbage Fanatics" Board</h1>
      </Row> */}
      <Row className="d-flex justify-content-center board-wrapper m-0 p-0">
        <Board />
      </Row>
    </Container>
  );
};

export default BoardPage;
