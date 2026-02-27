import React, { useState } from "react";
import { Image } from "react-bootstrap";

const ORIGINAL =
  "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/BingoHomescreen.png";
const ALT =
  "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/BingoHomeAlt.png";

const BingoHome = () => {
  const [src, setSrc] = useState<string>(ORIGINAL);

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
      >
        <Image
          src={src}
          alt="Bingo homescreen"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            cursor: "pointer",
          }}
          onMouseEnter={() => setSrc(ALT)}
          onMouseLeave={() => setSrc(ORIGINAL)}
        />
      </div>
    </div>
  );
};

export default BingoHome;
