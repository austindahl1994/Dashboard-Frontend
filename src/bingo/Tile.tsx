import React, { FC } from "react";
import { Card } from "react-bootstrap";
import "./Tile.css"; // optional external styles

interface TileProps {
  url: string;
  completed: boolean;
}

const Tile: FC<TileProps> = ({ url, completed }) => {
  return (
    <Card
      className="tile-card m-0 p-0"
      style={{ backgroundColor: `${completed ? "green" : "lightGray"}` }}
    >
      <Card.Img src={url} alt="Tile" className="tile-img" variant="top" />
    </Card>
  );
};

export default Tile;
