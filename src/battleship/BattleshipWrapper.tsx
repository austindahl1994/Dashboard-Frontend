import React from "react";
import BattleshipBoard from "./BattleshipBoard";
import { useQuery } from "@tanstack/react-query";
import { getBSBoard } from "../api";
import { Container, Row, Col } from "react-bootstrap";
import BattleshipInfo from "./BattleshipInfo";

const BattleshipWrapper: React.FC = () => {
  const cachedBSBoard = localStorage.getItem("battleshipBoard");
  const {
    data: board,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["BattleshipBoard"],
    queryFn: getBSBoard,
    retry: false,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    enabled: false, // !cachedBSBoard,
    initialData: cachedBSBoard ? JSON.parse(cachedBSBoard) : undefined,
  });

  return (
    <>
      <Container
        fluid
        className="p-0"
        style={{
          backgroundColor: "#000674",
          height: "100dvh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error loading board</div>
        ) : (
          <Row className="g-0 h-100 m-0 p-0">
            <Col xs={12} md={4} className="p-2">
              <BattleshipInfo />
            </Col>

            <Col xs={12} md={8}>
              <BattleshipBoard board={board} />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default BattleshipWrapper;
