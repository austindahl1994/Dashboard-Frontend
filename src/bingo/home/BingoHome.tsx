import React, { useRef, useState, useEffect } from "react";
import { Image } from "react-bootstrap";

const DEFAULT_SRC =
  "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/BingoHomescreen.png";
const ALT_SRC =
  "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/BingoHomeAlt.png";

const BingoHome: React.FC = () => {
  const [showAlt, setShowAlt] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    };
  }, []);

  const startHoverTimer = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setShowAlt(true), 3000);
  };

  const clearHoverTimer = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setShowAlt(false);
  };

  return (
    <div className="d-flex w-100 h-100 m-0 p-0 justify-content-center align-items-center">
      <div
        style={{
          width: "90vw",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onMouseEnter={startHoverTimer}
        onMouseLeave={clearHoverTimer}
        onFocus={startHoverTimer}
        onBlur={clearHoverTimer}
        tabIndex={0}
      >
        <Image
          src={showAlt ? ALT_SRC : DEFAULT_SRC}
          alt="Bingo homescreen"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default BingoHome;
