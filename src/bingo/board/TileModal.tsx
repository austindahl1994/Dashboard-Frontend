import { FC, useState, ChangeEvent, FormEvent } from "react";
import {
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  Form,
  Image,
  Modal,
  ProgressBar,
  Row,
} from "react-bootstrap";

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
  previews?: {
    rsn: string;
    url: string;
    item: string;
    obtained_at: string;
  }[];
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
  previews,
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

  const itemBadgeColor = (): string => {
    // UPDATE TO INSTEAD CHECK COMPLETIONS DATA SENT FOR THIS TILE, CHANGE COLOR IF ITEM COUNT > 0
    return "secondary";
  };

  const [selectedItem, setSelectedItem] = useState<string>(
    items && items.length ? items[0] : "",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setSelectedItem(e.target.value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedFile(
      e.target.files && e.target.files[0] ? e.target.files[0] : null,
    );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Upload Completion submitted:", { selectedItem, selectedFile });
    // TODO: wire up upload logic here (API call or parent callback)
  };

  type Preview = {
    rsn: string;
    url: string;
    item: string;
    obtained_at: string;
  };

  const exampleUrl =
    "https://cabbage-bounty.s3.us-east-2.amazonaws.com/completions/2/24/Lilcheenz-1768696470565";

  const previewsList: Preview[] =
    previews && previews.length
      ? previews
      : [
          {
            rsn: "Lilcheenz",
            url: exampleUrl,
            item: "Thammaron's sceptre (u)",
            obtained_at:
              "Sun Jan 18 2026 11:26:10 GMT-0600 (Central Standard Time)",
          },
          {
            rsn: "Lilcheenz",
            url: exampleUrl,
            item: "Thammaron's sceptre (u)",
            obtained_at:
              "Sun Jan 18 2026 11:26:10 GMT-0600 (Central Standard Time)",
          },
          {
            rsn: "Lilcheenz",
            url: exampleUrl,
            item: "Thammaron's sceptre (u)",
            obtained_at:
              "Sun Jan 18 2026 11:26:10 GMT-0600 (Central Standard Time)",
          },
        ];

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={isMobile ? "sm" : "xl"}
      centered
      animation
      style={{
        marginLeft: `isMobile ? "0em" : "15em"`,
        overflow: "auto",
        fontFamily: "Garamond",
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex flex-row align-items-center gap-3">
          <Badge className="h-50" bg={getBadgeColor()}>
            {badgeText}
          </Badge>
          <h1 className="m-0 p-0">{title}</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs="auto" md={4} className="d-flex justify-content-center">
            <Image
              className="modal-image"
              src={url}
              alt="Tile Image"
              style={{
                width: "auto",
                maxWidth: "100%",
                height: isMobile ? "100px" : "100%",
                maxHeight: isMobile ? "100px" : "300px",
                padding: "10px",
              }}
            />
          </Col>
          <Col md={8} style={{ overflow: "auto" }}>
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
            <h3>Items:</h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                fontFamily: "Times New Roman",
              }}
            >
              {items.map((item, i) => (
                <h6 className="m-0 p-0" key={i}>
                  <Badge className="m-0 p-1" bg={itemBadgeColor()}>
                    {item}
                  </Badge>
                </h6>
              ))}
            </div>
          </Col>
        </Row>
        <Row className="mt-2 d-flex">
          <Col xs={12} md={8} className="p-1">
            <Card
              style={{
                height: "12rem",
                width: "auto",
                border: "1px solid black",
                backgroundColor: "#222",
              }}
            >
              <Card.Body className="d-flex justify-content-center align-items-center">
                <Form onSubmit={handleSubmit} style={{ width: "90%" }}>
                  <Form.Group controlId="selectItem" className="mb-2">
                    <Form.Select
                      value={selectedItem}
                      onChange={handleSelectChange}
                      aria-label="Select item"
                    >
                      {items.map((item, idx) => (
                        <option key={idx} value={item}>
                          {item}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group controlId="uploadImage" className="mb-2">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {selectedFile ? (
                      <div className="mt-1 text-truncate">
                        {selectedFile.name}
                      </div>
                    ) : null}
                  </Form.Group>

                  <Button variant="light" type="submit" className="w-100">
                    Upload Completion
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          {/*Once we get completion data, don't show this column if no completions for the field? Or just say no completions in text instead of carosel*/}
          <Col className="p-1">
            <Carousel
              interval={5000}
              slide
              wrap
              style={{
                border: "1px solid black",
                borderRadius: 4,
                backgroundColor: "#222",
              }}
            >
              {previewsList.map((p, i) => (
                <Carousel.Item key={i} style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      textAlign: "center",
                      color: "#fff",
                      padding: "0.25rem 0",
                      zIndex: 2,
                    }}
                  >
                    <strong>{p.rsn}</strong>
                  </div>

                  <Image
                    className="d-block mx-auto"
                    style={{
                      height: "12rem",
                      width: "auto",
                      display: "block",
                      cursor: "pointer",
                    }}
                    src={p.url}
                    alt={`preview-${i}`}
                    onClick={() =>
                      window.open(p.url, "_blank", "noopener,noreferrer")
                    }
                  />

                  <Carousel.Caption>
                    <p>{p.item}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TileModal;
