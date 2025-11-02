import { Outlet } from "react-router-dom";
import BingoNavbar from "./BingoNavbar";
import { Col, Container, Row } from "react-bootstrap";

const Bingo = () => {
  return (
    <Container fluid className="vh-100 p-0">
      <Row>
        <Col xs={3} sm={2} md={2} lg={1} className="bg-light vh-100">
          <BingoNavbar />
        </Col>
        <Col xs={9} sm={10} md={10} lg={11} className="m-0 p-0 vh-100">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default Bingo;
//https://medium.com/@shruti.latthe/understanding-react-outlet-a-comprehensive-guide-b122b1e5e7ff
// ^^ site for understanding react outlet
