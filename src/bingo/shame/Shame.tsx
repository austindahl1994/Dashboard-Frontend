import React, { useState, useEffect } from "react";
import { Card, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// Only show shame for your team
const Shame = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    if (!passcode) navigate("/bingo/login", { replace: true });
  }, [navigate]);

  return (
    <div className="text-white">
      <h2>Shame</h2>
      <h6>Will only show shameful images for your team</h6>
      <h6>
        Will be a bunch of cards showing player deaths during the events along
        with what killed them OR instead of cards just have a grid of images?
      </h6>
      <Card style={{ width: "15rem", border: "1px solid #ccc" }}>
        <Card.Title className="text-center mt-1">Example Card</Card.Title>
        <div style={{ overflow: "hidden", borderRadius: 8 }}>
          <Image
            src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/shame/GIMP%2520Yzero-1768778485424"
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
            src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/shame/GIMP%2520Yzero-1768778485424"
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
