import React, { useState } from "react";
import { Card, Image, Modal } from "react-bootstrap";
// Only show shame for your team
const Shame = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="text-white">
      <h2>Shame</h2>
      <h6>
        Was thinking about being sneaky about this, but talked with Vinny and
        got the A OK to proceed with the event shame
      </h6>
      <h6>
        Will be a bunch of cards showing player deaths during the events along
        with what killed them OR instead of cards just have a grid of images?
      </h6>
      <Card style={{ width: "15rem", border: "1px solid #ccc" }}>
        <Card.Title className="text-center mt-1">Example Card</Card.Title>
        <div style={{ overflow: "hidden", borderRadius: 8 }}>
          <Image
            src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/shame/GIMP+Yzero1768659844812"
            alt="A shameful display"
            fluid
            onClick={() => setShow(true)}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              padding: "5px",
              cursor: "pointer",
            }}
            rounded
          />
        </div>
        <Card.Body>
          <p className="text-center">
            GIMP Yzero got slapped around by Leviathon...{" "}
          </p>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={() => setShow(false)} fullscreen centered>
        <Modal.Header closeButton />
        <Modal.Body
          className="d-flex justify-content-center align-items-center"
          style={{ background: "#000" }}
        >
          <Image
            src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/shame/GIMP+Yzero1768659844812"
            alt="shame fullscreen"
            fluid
            style={{ maxHeight: "90vh", objectFit: "contain" }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Shame;
