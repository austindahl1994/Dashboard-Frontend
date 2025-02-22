import { useState } from "react";
import Tile from "./Tile";

import "./board.css";

const Board = () => {
  const [showInfo, setShowInfo] = useState(false);
  const hexTotal = [5, 6, 7, 8, 9, 8, 7, 6, 5];
  const updateInfoState = () => {
    setShowInfo(!showInfo);
  };
  return (
    <div className="d-flex w-100 h-100">
      <div className="holder" style={{width: showInfo ? "75%" : "100%"}}>
        {hexTotal.map((hexCount, yIndex) => (
          <div className="hex-row" key={yIndex}>
            {Array(hexCount)
              .fill()
              .map((_, xIndex) => (
                <div key={xIndex}>
                  <Tile
                    xIndex={xIndex}
                    yIndex={yIndex}
                    updateInfoState={updateInfoState}
                  />
                </div>
              ))}
          </div>
        ))}
      </div>
      {showInfo && (
        <div className="info-box">
          <h1>Theatre of Blood</h1>
          <h2>Task: Get a purple from TOB</h2>
          <h3>Rules: No cheating</h3>
          <h4>Code when running: xShdXigf</h4>
          <h5>Remaining unlocks available for completion: 6</h5>
          <p>Discord command when complete:</p>
        </div>
      )}
    </div>
  );
};

export default Board;
