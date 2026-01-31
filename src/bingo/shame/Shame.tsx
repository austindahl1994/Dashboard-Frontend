import React, { useState, useEffect } from "react";
import { Card, Image, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShame } from "../../api";

type ShameItem = {
  playerName: string;
  pvp: 0 | 1;
  killer: string | null;
  url: string;
};

// Only show shame for your team
const Shame: React.FC = () => {
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalCaption, setModalCaption] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    if (!passcode) navigate("/bingo/login", { replace: true });
  }, [navigate]);

  const passcode = localStorage.getItem("passcode") || undefined;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shame", passcode],
    queryFn: () => getShame({ passcode }),
    enabled: !!passcode,
  });

  // Normalize API response to an array of ShameItem
  const shameItems: ShameItem[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as ShameItem[];
    if (Array.isArray((data as any).data)) return (data as any).data;
    if (Array.isArray((data as any).shame)) return (data as any).shame;
    return [];
  })();

  const openModal = (item: ShameItem) => {
    setModalUrl(fixUrl(item.url));
    const caption = `${item.playerName}${item.killer ? `- killed by ${item.killer}` : item.pvp ? " - PvP" : ""}`;
    setModalCaption(caption);
  };

  const fixUrl = (u?: string | null): string | null =>
    u ? u.replace(/%20/g, "%2520") : null;

  return (
    <div className="text-white d-flex w-100 h-100 overflow-auto">
      {isLoading ? (
        <div className="d-flex justify-content-center py-4">
          <Spinner animation="border" />
        </div>
      ) : isError ? (
        <div className="text-danger">Failed to load shame data.</div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {shameItems.map((item: ShameItem, idx: number) => (
            <Card
              key={idx}
              style={{
                width: "12rem",
                height: "15rem",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => openModal(item)}
            >
              <Card.Title className="text-center mt-1">
                {idx + 1 + ". "}
                {item.playerName}
              </Card.Title>
              <div style={{ overflow: "hidden", borderRadius: 8 }}>
                <Image
                  src={fixUrl(item.url) || undefined}
                  alt={`${item.playerName} shame`}
                  fluid
                  style={{
                    width: "100%",
                    height: "10rem",
                    objectFit: "cover",
                    padding: "5px",
                  }}
                  rounded
                />
              </div>
              <Card.Body>
                <p className="text-center mb-0">
                  {item.killer
                    ? `Killed by ${item.killer}`
                    : item.pvp
                      ? "PvP"
                      : "PvE"}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal
        show={!!modalUrl}
        onHide={() => {
          setModalUrl(null);
          setModalCaption(null);
        }}
        fullscreen
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalCaption}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="d-flex justify-content-center align-items-center"
          style={{ background: "#000" }}
        >
          {modalUrl && (
            <Image
              src={modalUrl}
              alt="shame fullscreen"
              fluid
              style={{ maxHeight: "90vh", objectFit: "contain" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Shame;
