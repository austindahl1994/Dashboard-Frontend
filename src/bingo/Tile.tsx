import React, { FC } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import "./tile.css"; // optional external styles
import { BoardTile } from "./Board";

interface TileProps {
  id: number;
  title: string;
  description: string;
  url: string;
  items: string[];
  tier: number;
  quantity: number;
  source: string;
  completed?: number;
  setSelectedTile: (tile: BoardTile) => void;
}

const Tile: FC<TileProps> = ({
  id,
  title,
  url = "https://oldschool.runescape.wiki/images/Cabbage_detail.png?08f34",
  tier,
  description,
  quantity,
  source,
  items,
  completed = 0,
  setSelectedTile,
}) => {
  // completed > quantity ? "green" :
  const color: string = completed >= quantity ? "black" : getColor(tier);

  //Can break it down into completedLabel and leftLabel for 0/8 or 8/8 OR 10/7 as examples
  const completedLabel: string =
    completed === 0
      ? ""
      : completed >= quantity
      ? `COMPLETED`
      : completed.toString();
  const leftLabel: string =
    completed > quantity
      ? ""
      : completed === 0
      ? `0 / ${quantity}`
      : quantity.toString();
  const completion: number =
    completed === 0 ? 0 : Math.min((completed / quantity) * 100, 100);
  const left: number = completed === 0 ? 100 : Math.max(100 - completion, 0);

  return (
    <>
      <Card
        className="tile-card m-0 p-0 d-flex flex-column justify-content-between align-items-center"
        style={{ backgroundColor: color }}
        onClick={() =>
          setSelectedTile({
            id,
            title,
            description,
            source,
            items,
            tier,
            quantity,
            url,
            // completed,
          })
        }
      >
        <Card.Body className="w-100 h-50 m-0 p-1 d-flex flex-column justify-content-evenly align-items-center">
          <Card.Img
            src={
              completed >= quantity
                ? "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/Tick.png"
                : url
            }
            alt="Tile"
            className="tile-img"
            variant="top"
          />
          <ProgressBar className="w-100">
            <ProgressBar
              label={completedLabel}
              now={completion}
              animated={completed < quantity}
              striped={completed < quantity}
              variant="success"
            />
            <ProgressBar label={leftLabel} now={left} variant="danger" />
          </ProgressBar>
        </Card.Body>
      </Card>
    </>
  );
};

const getColor = (tier: number): string => {
  let color: string;
  switch (tier) {
    case 1:
      color = "rgba(0, 128, 0, 0.25)";
      break;
    case 2:
      color = "rgba(85, 169, 197, .25)";
      break;
    case 3:
      color = "rgba(128, 0, 128, 0.25)";
      break;
    case 4:
      color = "rgba(255, 255, 0, 0.25)";
      break;
    case 5:
      color = "rgba(255, 0, 0, 0.25)";
      break;
    default:
      color = "rgba(211, 211, 211, 0.25)";
      break;
  }

  return color;
};

export default Tile;
