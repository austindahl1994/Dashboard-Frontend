import { FC } from "react";
import { Badge, Col, Image, Modal, ProgressBar, Row } from "react-bootstrap";

interface TileProps {
  show: boolean;
  handleClose: () => void;
  title: string;
  url: string;
  tier: number;
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
  notes,
  quantity,
  completed,
}) => {
  const progress: number =
    quantity === 0 ? 0 : Math.min((completed / quantity) * 100, 100);

  const getBadgeColor = (): string => {
    if (progress === 100) return "success";
    if (progress >= 50) return "warning";
    return "danger";
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <h1>{title}</h1>
          <Badge bg={getBadgeColor()}>{`${completed}/${quantity}`}</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Image
              src={url}
              alt="Tile Image"
              style={{ width: "100%", height: "100%" }}
            />
          </Col>
          <Col>
            <h2>Tier: {tier || "Unknown"}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html:
                  notes ||
                  "No special notes for this tile, just go out and get it done!",
              }}
            />
          </Col>
          {/* <Col>
            <ProgressBar>
              <ProgressBar striped animated now={progress} variant="success" />
              <ProgressBar now={remaining} variant="danger" />
            </ProgressBar>
          </Col> */}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TileModal;
