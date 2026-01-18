import { FC, useState } from "react";
import { Badge, Col, Image, Modal, ProgressBar, Row } from "react-bootstrap";

interface TileProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  url: string;
  tier: number;
  items: string[];
  source: string;
  notes: string;
  quantity: number;
  completed: number;
}

const TileModal: FC<TileProps> = ({
  show,
  handleClose,
  title,
  url,
  tier,
  items,
  source,
  notes,
  quantity,
  completed,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );
  const progress: number =
    quantity === 0 ? 0 : Math.min((completed / quantity) * 100, 100);

  const getBadgeColor = (): string => {
    if (progress === 100) return "success";
    if (progress >= 10) return "warning";
    return "danger";
  };

  const modifiedNotes: string = notes
    .split("*")
    .map((part, index) => (index % 2 === 1 ? `<strong>${part}</strong>` : part))
    .join("");

  const badgeText: string =
    completed >= quantity ? "COMPLETED" : `${completed}/${quantity}`;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={isMobile ? "sm" : "xl"}
      centered
      animation
      style={{ marginLeft: "10em" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h1>{title}</h1>
          <Badge bg={getBadgeColor()}>{badgeText}</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Image
              className="modal-image"
              src={url}
              alt="Tile Image"
              style={{
                width: "auto",
                height: "100%",
                maxHeight: "300px",
                padding: "10px",
              }}
            />
          </Col>
          <Col>
            <h2>Tier: {tier || "Unknown"}</h2>
            {source ? (
              <h4>{`Must be obtained from: ${
                source[0].toUpperCase() + source.slice(1)
              }`}</h4>
            ) : null}
            <p
              dangerouslySetInnerHTML={{
                __html:
                  modifiedNotes ||
                  "No special notes for this tile, just go out and get it done!",
              }}
            />
          </Col>
          <Col>
            <h3>Items:</h3>
            <ul>
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Col>

          {/* <Col>
            <ProgressBar>
              <ProgressBar striped animated now={progress} variant="success" />
              <ProgressBar now={remaining} variant="danger" />
            </ProgressBar>
          </Col> */}
        </Row>
        <Row className="mt-2">
          <Image
            style={{ height: "12rem", width: "auto" }}
            src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/completions/2/24/Lilcheenz-1768696470565"
          />
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TileModal;
