import React from "react";
import { Image } from "react-bootstrap";

const BingoHome = () => {
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
          src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/BingoHomescreen.png"
          alt="Bingo homescreen"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default BingoHome;
