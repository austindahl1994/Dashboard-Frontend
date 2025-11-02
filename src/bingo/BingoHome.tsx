import React from "react";
import { Image } from "react-bootstrap";

const BingoHome = () => {
  return (
    <div className="d-flex w-100 h-100 m-0 p-0 justify-content-center">
      <Image
        src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/BingoHomescreen.png"
        fluid
      />
    </div>
  );
};

export default BingoHome;
