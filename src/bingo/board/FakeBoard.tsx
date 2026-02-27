import React, { useEffect, useRef, useState } from "react";
import { Container, Card } from "react-bootstrap";
import "./boardPage.css";
import "./FakeBoard.css";

const GIF_URL = "https://oldschool.runescape.wiki/images/Dance.gif?dbc16";

const FakeBoard: React.FC = () => {
  const size = 5;
  const count = size * size;
  const tiles = Array.from({ length: count });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const pickMs = 2250; // how often to pick a tile
    const showMs = 4500; // how long the gif shows

    function pickRandom(prev: number | null) {
      let next = Math.floor(Math.random() * count);
      if (count > 1 && next === prev) next = (next + 1) % count;
      return next;
    }

    // pick immediately once
    const first = pickRandom(null);
    setActiveIndex(first);
    timeoutRef.current = window.setTimeout(() => setActiveIndex(null), showMs);

    intervalRef.current = window.setInterval(() => {
      const next = pickRandom(activeIndex);
      setActiveIndex(next);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(
        () => setActiveIndex(null),
        showMs,
      );
    }, pickMs) as unknown as number;

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <Container
      fluid
      className="p-0 m-0 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgb(55,55,55)", minHeight: "100%" }}
    >
      <div className="fake-board-outer">
        <div className="fake-board">
          {tiles.map((_, idx) => {
            const isActive = idx === activeIndex;
            return (
              <Card
                key={idx}
                className={`fake-tile ${isActive ? "active" : ""}`}
              >
                <div className="fake-inner">
                  {isActive ? (
                    <img src={GIF_URL} alt={`dance-gif-${idx}`} />
                  ) : (
                    <div className="question-mark">?</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default FakeBoard;
