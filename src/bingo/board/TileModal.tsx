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

interface Completion {
  team: number;
  tile_id: number;
  rsn: string;
  url: string;
  item: string;
  obtained_at: string;
}

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
  completions?: Completion[];
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
  completions,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );

  const fixUrl = (u?: string | null): string | null =>
    u ? u.replace(/%20/g, "%2520") : null;
  const progress: number =
    quantity === 0
      ? 0
      : Math.min(
          ((completions ? completions.length : 0) / quantity) * 100,
          100,
        );

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
    completions && completions.length >= quantity
      ? `COMPLETED (${completions.length}/${quantity})`
      : `${completions ? completions.length : 0}/${quantity}`;

  const itemBadgeColor = (itemName: string): string => {
    const count = completions
      ? completions.filter(
          (p) => p.item.toLowerCase() === itemName.toLowerCase(),
        ).length
      : 0;
    return count > 0 ? "primary" : "dark";
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
    if (!selectedFile) {
      console.warn("No file selected for upload");
      return;
    }
    console.log("Upload Completion submitted:", { selectedItem, selectedFile });
    // TODO: wire up upload logic here (API call or parent callback)
  };

  const hasCompletions = completions && completions.length > 0;
  const completionCount = completions ? completions.length : 0;
  const isCompleted = completionCount >= quantity;

  const getColor = (tier: number): string => {
    let color: string;
    switch (tier) {
      case 1:
        color = "rgba(0, 128, 0, 0.25)";
        break;
      case 2:
        color = "rgba(85, 169, 197, .25)";
        break;
      case 3:
        color = "rgba(128, 0, 128, 0.25)";
        break;
      case 4:
        color = "rgba(255, 255, 0, 0.25)";
        break;
      case 5:
        color = "rgba(255, 0, 0, 0.25)";
        break;
      default:
        color = "rgba(211, 211, 211, 0.25)";
        break;
    }

    return color;
  };

  const getOpaqueColor = (color: string): string => {
    const m = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, 1)`;
    return color;
  };

  const cardBg = isCompleted ? getOpaqueColor(getColor(tier)) : getColor(tier);

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
      <Modal.Body style={{ backgroundColor: "#f6f6f6" }}>
        <Row>
          <Col xs="auto" md={4} className="d-flex justify-content-center">
            <Image
              className="modal-image"
              src={fixUrl(url) || undefined}
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
              <h4>{`Must be obtained from: ${source[0].toUpperCase() + source.slice(1)}`}</h4>
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
                  <Badge className="m-0 p-1" bg={itemBadgeColor(item)}>
                    {item ? item[0].toUpperCase() + item.slice(1) : item}
                    {completions &&
                    completions.filter((p) => p.item === item).length ? (
                      <span
                        style={{ marginLeft: 6, fontSize: 12, opacity: 0.9 }}
                      >
                        ({completions.filter((p) => p.item === item).length})
                      </span>
                    ) : null}
                  </Badge>
                </h6>
              ))}
            </div>
          </Col>
        </Row>
        <Row className="m-1 d-flex">
          <Col xs={12} md={hasCompletions ? 8 : 12} className="p-1">
            <Card
              style={{
                height: "12rem",
                width: "auto",
                border: "1px solid black",
                backgroundColor: cardBg,
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
                          {item ? item[0].toUpperCase() + item.slice(1) : item}
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
                  </Form.Group>

                  <Button
                    variant={!selectedFile ? "secondary" : "primary"}
                    type="submit"
                    className="w-100"
                    disabled={!selectedFile}
                  >
                    Upload Completion
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          {/*Once we get completion data, don't show this column if no completions for the field? Or just say no completions in text instead of carosel*/}
          {hasCompletions && (
            <Col md={4} className="p-1">
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
                {completions!.map((p, i) => (
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
                      src={fixUrl(p.url) || undefined}
                      alt={`preview-${i}`}
                      onClick={() =>
                        window.open(
                          fixUrl(p.url) || p.url,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    />

                    <Carousel.Caption>
                      <p>{p.item}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default TileModal;
