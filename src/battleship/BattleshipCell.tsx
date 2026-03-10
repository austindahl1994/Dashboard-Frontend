import React from "react";
import { Card } from "react-bootstrap";
import { Cell } from "./BattleshipBoard";

const BattleshipCell: React.FC<{ cell: Cell }> = ({ cell }) => {
  const shotLabel = cell.obtained ? (cell.isHit ? "1" : "0") : null;

  return (
    <Card
      className="h-100 w-100 p-2"
      style={{
        backgroundColor: cell.isHit
          ? "#ff4d4d"
          : cell.hasShip
            ? "#000000"
            : "#9ac3f5",
        position: "relative",
      }}
    >
      <Card.Img
        src={cell.url}
        style={{ objectFit: "contain", maxHeight: "100%" }}
      />
      {shotLabel && <div className="bs-shot-label">{shotLabel}</div>}
    </Card>
  );
};

export default BattleshipCell;
