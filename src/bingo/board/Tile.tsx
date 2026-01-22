import React, { FC } from "react";
import { Card, ProgressBar } from "react-bootstrap";
import "./tile.css"; // optional external styles
import { BoardTile } from "./Board";

type Completion = {
  team: number;
  tile_id: number;
  rsn: string;
  url: string;
  item: string;
  obtained_at: string;
};

interface TileProps {
  id: number;
  title: string;
  description: string;
  url: string;
  items: string[];
  tier: number;
  quantity: number;
  source: string;
  completed?: number; // legacy but allowed
  completions?: Completion[]; // array of completion objects for this tile
  setSelectedTile: (tile: BoardTile) => void;
  getColor?: (tier: number) => string;
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
  completions = [],
  setSelectedTile,
  getColor: getColorProp,
}) => {
  // completed > quantity ? "green" :
  const completionCount = completions ? completions.length : completed || 0;
  const getOpaqueColor = (colorStr: string): string => {
    const m = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
    if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, 1)`;
    return colorStr;
  };

  const color: string =
    completionCount >= quantity
      ? getOpaqueColor(getColorProp ? getColorProp(tier) : getColor(tier))
      : getColorProp
        ? getColorProp(tier)
        : getColor(tier);

  //Can break it down into completedLabel and leftLabel for 0/8 or 8/8 OR 10/7 as examples
  const completedLabel: string =
    completionCount === 0
      ? ""
      : completionCount >= quantity
        ? `COMPLETED`
        : completionCount.toString();
  const leftLabel: string =
    completionCount > quantity
      ? ""
      : completionCount === 0
        ? `0 / ${quantity}`
        : quantity.toString();
  const completionPercent: number =
    completionCount === 0
      ? 0
      : Math.min((completionCount / quantity) * 100, 100);
  const left: number =
    completionCount === 0 ? 100 : Math.max(100 - completionPercent, 0);

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
          })
        }
      >
        <Card.Body className="w-100 h-50 m-0 p-1 d-flex flex-column justify-content-evenly align-items-center">
          {/* Apply grayscale filter if completed */}
          <Card.Img
            src={
              completionCount >= quantity
                ? "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/Tick.png"
                : url
            }
            alt={title}
            className="tile-img"
            variant="top"
            // style={{
            //   filter:
            //     completionCount >= quantity
            //       ? "brightness(0) saturate(100%)"
            //       : undefined,
            // }}
          />
          <ProgressBar className="w-100">
            <ProgressBar
              label={completedLabel}
              now={completionPercent}
              animated={completionCount < quantity}
              striped={completionCount < quantity}
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
