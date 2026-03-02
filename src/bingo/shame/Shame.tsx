import React, { useState, useEffect, useRef } from "react";
import { Card, Image, Modal, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getShame } from "../../api";
import EventCountdown from "../board/EventCountdown";

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
  // Container ref for scrolling
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cutoff: Feb 28 2026 08:00 CST (UTC-6) => 2026-02-28T14:00:00Z
  const cutoff = new Date(Date.UTC(2026, 1, 28, 14, 0, 0));
  const isBeforeCutoff = Date.now() < cutoff.getTime();

  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    if (!passcode && !isBeforeCutoff)
      navigate("/bingo/login", { replace: true });
  }, [navigate]);

  const passcode = localStorage.getItem("passcode") || undefined;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shame", passcode],
    queryFn: () => getShame({ passcode }),
    enabled: !!passcode && !isBeforeCutoff,
  });

  // Normalize API response to an array of ShameItem
  const shameItems: ShameItem[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data as ShameItem[];
    if (Array.isArray((data as any).data)) return (data as any).data;
    if (Array.isArray((data as any).shame)) return (data as any).shame;
    return [];
  })();

  // Persist aggregated death/shame counts to localStorage whenever shame data updates
  useEffect(() => {
    try {
      const counts: Record<string, number> = {};
      shameItems.forEach((item) => {
        const name = (item.playerName || "Unknown").trim();
        if (!name) return;
        counts[name] = (counts[name] || 0) + 1;
      });

      localStorage.setItem("deathCounts", JSON.stringify(counts));
    } catch (err) {
      // non-fatal: log but don't break UI
      // eslint-disable-next-line no-console
      console.error("Failed to persist deathCounts to localStorage", err);
    }
  }, [shameItems]);

  // Filter control: selected player name ("All" shows everyone)
  const [selectedPlayer, setSelectedPlayer] = useState<string>("All");

  // Build list of unique player names from shameItems for the dropdown
  const playerNames: string[] = Array.from(
    new Set(shameItems.map((s) => (s.playerName || "").trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b));

  const displayedItems =
    selectedPlayer === "All"
      ? shameItems
      : shameItems.filter(
          (s) => (s.playerName || "").trim() === selectedPlayer,
        );

  // Scroll to bottom on load / when displayed items change
  useEffect(() => {
    if (!displayedItems) return;
    if (isLoading) return;

    const scrollToBottom = () => {
      try {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        } else if (typeof window !== "undefined") {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "auto",
          });
        }
      } catch (err) {
        // ignore
      }
    };

    const t = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(t);
  }, [isLoading, displayedItems?.length]);

  if (isBeforeCutoff) {
    return <EventCountdown />;
  }

  const openModal = (item: ShameItem) => {
    setModalUrl(fixUrl(item.url));
    const caption = `${item.playerName}${item.killer ? `- killed by ${item.killer}` : item.pvp ? " - PvP" : ""}`;
    setModalCaption(caption);
  };

  const fixUrl = (u?: string | null): string | null =>
    u ? u.replace(/%20/g, "%2520") : null;

  return (
    <div className="text-white d-flex flex-column w-100 h-100">
      <h1 className="w-100 text-center">Shameful Acts</h1>

      {isLoading ? (
        <div className="d-flex justify-content-center py-4">
          <Spinner animation="border" />
        </div>
      ) : data === null ? (
        <div className="text-white">
          Your team has not commited any shameful acts... yet.
        </div>
      ) : isError ? (
        <div className="text-danger">Failed to load shame data.</div>
      ) : (
        <>
          <div className="d-flex justify-content-end p-2">
            <label className="text-white me-2" htmlFor="shame-filter">
              Filter:
            </label>
            <select
              id="shame-filter"
              className="form-select w-auto"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
            >
              <option value="All">All</option>
              {playerNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignContent: "flex-start",
              alignItems: "flex-start",
              flex: 1,
              overflow: "auto",
              padding: 8,
            }}
          >
            {displayedItems?.map((item: ShameItem, idx: number) => (
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
                {item.playerName.toLowerCase() === "kirk iron" && (
                  <Card.Body>
                    <p className="text-center mb-0">What a dumbass</p>
                  </Card.Body>
                )}
                {item.playerName.toLowerCase() === "gimp yzero" && (
                  <Card.Body>
                    <p className="text-center mb-0">Fuck Yzero</p>
                  </Card.Body>
                )}
              </Card>
            ))}
          </div>
        </>
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
          <Modal.Title className="w-100 text-center">
            {modalCaption}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="d-flex justify-content-center align-items-center p-0 m-0"
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
