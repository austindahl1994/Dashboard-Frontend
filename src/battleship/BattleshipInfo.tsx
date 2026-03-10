import React from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";

const BattleshipInfo: React.FC = () => {
  const ships = [
    { name: "Destroyer", images: ["FirstHalf1", "LastHalf1"] },
    { name: "Submarine", images: ["FirstHalf1", "FirstHalf1", "LastHalf1"] },
    { name: "Cruiser", images: ["FirstHalf1", "FirstHalf1", "LastHalf1"] },
    {
      name: "Battleship",
      images: ["FirstHalf1", "FirstHalf1", "FirstHalf1", "LastHalf1"],
    },
    {
      name: "Carrier",
      images: [
        "FirstHalf1",
        "FirstHalf1",
        "FirstHalf1",
        "FirstHalf1",
        "LastHalf1",
      ],
    },
  ];

  const renderCard = (
    hasImage: boolean,
    imageKey?: string,
    segmentIndex?: number,
  ) => (
    <div
      key={`${imageKey || "empty"}-${segmentIndex}`}
      style={{
        flex: 1,
        minHeight: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {hasImage && (
        <Image
          src={`https://cabbage-bounty.s3.us-east-2.amazonaws.com/boats/${imageKey}.png`}
          alt={`${imageKey} Segment ${segmentIndex}`}
          style={{
            objectFit: "contain",
            height: "100%",
            width: "100%",
            padding: "0px",
            margin: "0px",
          }}
        />
      )}
    </div>
  );

  return (
    <Card
      className="h-100 d-flex flex-column"
      style={{
        maxHeight: "100%",
        overflow: "hidden",
        backgroundColor: "#6c71d7",
      }}
    >
      <Card.Title className="d-flex text-center justify-content-center align-items-center">
        <h5 className="text-white no-wrap p-0 m-0" style={{ fontSize: "100%" }}>
          OSRS Battleship... but Dubz Cheats!
        </h5>
      </Card.Title>
      <Card.Body
        style={{ overflowY: "auto", flex: 1, backgroundColor: "#9ac3f5" }}
      >
        <Container fluid className="p-0 d-flex flex-column m-0 h-100">
          <Col className="h-100 d-flex flex-column gap-2 w-100">
            {ships.map((ship) => {
              const emptyCount = 5 - ship.images.length;
              return (
                <Card key={ship.name} className="flex-shrink-0">
                  <Card.Title className="text-center mb-0">
                    {ship.name}
                  </Card.Title>
                  <Card.Body className="p-2 overflow-hidden">
                    <Row className="d-flex flex-row flex-nowrap gap-0 w-100 m-0">
                      {/* Empty Cards */}
                      {Array.from({ length: emptyCount }).map((_, i) =>
                        renderCard(false, undefined, i),
                      )}
                      {/* Image Cards */}
                      {ship.images.map((imageKey, i) =>
                        renderCard(true, imageKey, i + 1),
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              );
            })}
          </Col>
        </Container>
      </Card.Body>
      <Card.Footer className="d-flex flex-column justify-content-center">
        <Button>Copy Dink Data</Button>
      </Card.Footer>
    </Card>
  );
};

export default BattleshipInfo;
