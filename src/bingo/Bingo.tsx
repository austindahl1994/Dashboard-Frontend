import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import BingoNavbar from "./BingoNavbar";
import { Col, Container, Row } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { getBoard } from "../api";

const Bingo = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    const board = localStorage.getItem("board");
    if (!passcode || board) return; // do nothing unless a valid passcode is cached and board is not already cached

    // Fetch and cache the board when entering any bingo page
    queryClient
      .fetchQuery({ queryKey: ["board"], queryFn: getBoard })
      .then((data) => {
        if (data) {
          try {
            localStorage.setItem("board", JSON.stringify(data));
          } catch (err) {
            console.error("Failed to write board to localStorage:", err);
          }
        }
      })
      .catch((err) =>
        console.error("Error fetching board on Bingo mount:", err),
      );
  }, [queryClient]);
  return (
    <Container
      fluid
      className="vh-100 vw-100 p-0"
      style={{ backgroundColor: "rgb(55,55,55)" }}
    >
      <Row>
        <Col
          xs={3}
          sm={3}
          md={3}
          lg={2}
          className="d-flex vh-100 text-center bg-light"
        >
          <BingoNavbar />
        </Col>
        <Col
          xs={9}
          sm={9}
          md={9}
          lg={10}
          className="m-0 p-0 vh-100 d-flex flex-column justify-content-center align-items-center"
          style={{ backgroundColor: "rgb(55, 55, 55)" }}
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default Bingo;
//https://medium.com/@shruti.latthe/understanding-react-outlet-a-comprehensive-guide-b122b1e5e7ff
// ^^ site for understanding react outlet
