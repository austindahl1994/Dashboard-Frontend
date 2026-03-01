import React, { FC, useEffect, useState } from "react";
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
  const [checkEnabled, setCheckEnabled] = useState<boolean>(false);
  const [raveEnabled, setRaveEnabled] = useState<boolean>(false);
  const [hoverEnabled, setHoverEnabled] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    try {
      setCheckEnabled(localStorage.getItem("bingo_check") === "true");
    } catch (err) {
      setCheckEnabled(false);
    }
    try {
      setRaveEnabled(localStorage.getItem("bingo_rave") === "true");
    } catch (err) {
      setRaveEnabled(false);
    }
    try {
      setHoverEnabled(localStorage.getItem("bingo_hover") === "true");
    } catch (err) {
      setHoverEnabled(false);
    }

    const onCheck = (e: Event) => {
      try {
        const custom = e as CustomEvent;
        setCheckEnabled(!!custom?.detail?.value);
      } catch (err) {
        setCheckEnabled(localStorage.getItem("bingo_check") === "true");
      }
    };

    const onRave = (e: Event) => {
      try {
        const custom = e as CustomEvent;
        setRaveEnabled(!!custom?.detail?.value);
      } catch (err) {
        setRaveEnabled(localStorage.getItem("bingo_rave") === "true");
      }
    };

    const onHover = (e: Event) => {
      try {
        const custom = e as CustomEvent;
        setHoverEnabled(!!custom?.detail?.value);
      } catch (err) {
        setHoverEnabled(localStorage.getItem("bingo_hover") === "true");
      }
    };

    window.addEventListener("bingoCheckChanged", onCheck as EventListener);
    window.addEventListener("bingoRaveChanged", onRave as EventListener);
    window.addEventListener("bingoHoverChanged", onHover as EventListener);

    return () => {
      window.removeEventListener("bingoCheckChanged", onCheck as EventListener);
      window.removeEventListener("bingoRaveChanged", onRave as EventListener);
      window.removeEventListener("bingoHoverChanged", onHover as EventListener);
    };
  }, []);
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

  const capitalize = (s: string) =>
    s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  const cardClass = `tile-card m-0 p-0 d-flex flex-column justify-content-between align-items-center ${
    raveEnabled && completionCount >= quantity ? "rave-tile" : ""
  }`;

  const cardStyle =
    raveEnabled && completionCount >= quantity
      ? {}
      : { backgroundColor: color };

  return (
    <>
      <Card
        className={cardClass}
        style={cardStyle}
        onMouseEnter={(e) => {
          setIsHovered(true);
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setHoverPos({ x: rect.right + 12, y: rect.top });
          setHoverRect(rect);
        }}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setHoverPos({ x: rect.right + 12, y: rect.top });
          setHoverRect(rect);
        }}
        onMouseLeave={() => setIsHovered(false)}
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
          {completionCount >= quantity ? (
            // when completed
            checkEnabled ? (
              // show original full-size checkmark image (no rave)
              <Card.Img
                src={
                  "https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/Tick.png"
                }
                alt={title}
                className="tile-img"
                variant="top"
                style={{
                  filter: raveEnabled
                    ? undefined
                    : "brightness(0) saturate(100%)",
                }}
              />
            ) : (
              // check disabled -> show original url
              <Card.Img
                src={url}
                alt={title}
                className="tile-img"
                variant="top"
              />
            )
          ) : (
            <Card.Img
              src={url}
              alt={title}
              className="tile-img"
              variant="top"
            />
          )}
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

      {hoverEnabled &&
        isHovered &&
        (() => {
          // compute popup positioning and maxHeight to fit viewport
          const itemHeight = 20; // approx per-item height in px
          const baseHeight = 24; // padding/title space
          const desiredHeight = baseHeight + items.length * itemHeight;
          const viewportH =
            typeof window !== "undefined" ? window.innerHeight : 800;
          let top = hoverPos.y;
          let left = hoverPos.x;
          let maxHeight: number | undefined = undefined;
          let overflowY: "auto" | "visible" = "visible";
          if (hoverRect) {
            const spaceBelow = viewportH - hoverRect.bottom - 12; // space below tile
            const spaceAbove = hoverRect.top - 12; // space above tile
            if (desiredHeight <= spaceBelow) {
              top = hoverRect.bottom + 12;
            } else if (desiredHeight <= spaceAbove) {
              top = Math.max(8, hoverRect.top - desiredHeight - 12);
            } else {
              // not enough space either side — fit into larger side with scrolling
              if (spaceBelow >= spaceAbove) {
                top = hoverRect.bottom + 12;
                maxHeight = Math.max(40, spaceBelow - 8);
              } else {
                // place above
                top = Math.max(
                  8,
                  hoverRect.top - Math.max(40, spaceAbove) - 12,
                );
                maxHeight = Math.max(40, spaceAbove - 8);
              }
              overflowY = "auto";
            }
            // ensure left fits in viewport
            const viewportW =
              typeof window !== "undefined" ? window.innerWidth : 1200;
            if (left + 300 > viewportW) {
              left = Math.max(8, viewportW - 320);
            }
          }

          const style: React.CSSProperties = {
            top,
            left,
            position: "fixed",
            zIndex: 9999,
          };
          if (maxHeight) style.maxHeight = maxHeight;
          if (overflowY === "auto") style.overflowY = "auto";

          return (
            <div className="tile-hover-popup" style={style} role="dialog">
              <ul className="tile-hover-items">
                {items.map((it, i) => (
                  <li key={i}>{capitalize(String(it))}</li>
                ))}
              </ul>
            </div>
          );
        })()}
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
