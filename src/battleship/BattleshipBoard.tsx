import React from "react";
import BattleshipCell from "./BattleshipCell";
import { Card, Container } from "react-bootstrap";
import "./battleshipStyles.css";

/**
 Board of 10x10, but also need first column of letters A-J and first row of numbers 1-10
 Data will be: Array of Battleship objects
 Battleship {
  id: number,
  coord: string, // A1, B5, etc.
  url?: string, // url of the ship image
  isHit: boolean, 
  obtained: boolean, // whether the tile was obtained by a player already
 }
  When calling data, for every row insert the correct letter, if the index is zero, use the array of numbers
 */
export interface Cell {
  coord: string;
  id: number;
  url?: string;
  isHit: boolean;
  obtained: boolean;
  hasShip?: boolean;
}

interface BSBoardProps {
  board: Cell[];
}

const letterArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const hsURL =
  "https://oldschool.runescape.wiki/images/archive/20181118201134%21Damage_hitsplat.png?ec86e";
const missURL =
  "https://oldschool.runescape.wiki/images/Zero_damage_hitsplat.png?f1986";
const testURL =
  "https://oldschool.runescape.wiki/images/Bandos_chestplate_detail.png?98028";

const BOARD_SIZE = 10;
const SHIP_LENGTHS = [5, 4, 3, 3, 2, 5, 4, 3, 3, 2];

const toCoord = (row: number, col: number): string =>
  `${letterArr[row]}${col + 1}`;

const placeShips = (): Set<string> => {
  const occupied = new Set<string>();

  for (const length of SHIP_LENGTHS) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 500) {
      attempts += 1;
      const isHorizontal = Math.random() < 0.5;
      const startRow = isHorizontal
        ? Math.floor(Math.random() * BOARD_SIZE)
        : Math.floor(Math.random() * (BOARD_SIZE - length + 1));
      const startCol = isHorizontal
        ? Math.floor(Math.random() * (BOARD_SIZE - length + 1))
        : Math.floor(Math.random() * BOARD_SIZE);

      const candidate: string[] = [];

      for (let i = 0; i < length; i += 1) {
        const row = isHorizontal ? startRow : startRow + i;
        const col = isHorizontal ? startCol + i : startCol;
        candidate.push(toCoord(row, col));
      }

      const overlaps = candidate.some((coord) => occupied.has(coord));
      if (!overlaps) {
        candidate.forEach((coord) => occupied.add(coord));
        placed = true;
      }
    }
  }

  return occupied;
};

const fakeShipTiles = placeShips();

const fakeBoard: Cell[] = Array.from({ length: 100 }, (_, i) => {
  const row = Math.floor(i / BOARD_SIZE);
  const col = i % BOARD_SIZE;
  const coord = toCoord(row, col);
  const hasShip = fakeShipTiles.has(coord);

  const obtained = Math.random() < 0.4;
  const isHit = obtained && hasShip;

  return {
    coord,
    id: i,
    url: obtained ? (isHit ? hsURL : missURL) : testURL,
    isHit,
    obtained,
    hasShip,
  };
});

const BSBoard: React.FC<BSBoardProps> = ({ board }) => {
  const sourceBoard = board && board.length === 100 ? board : fakeBoard;
  const coordMap = new Map(sourceBoard.map((cell) => [cell.coord, cell]));

  const finalBoard: Cell[][] = letterArr.map((letter, rowIdx) =>
    numArr.map((num, colIdx) => {
      const coord = `${letter}${num}`;
      return (
        coordMap.get(coord) || {
          coord,
          id: rowIdx * 10 + colIdx,
          isHit: false,
          obtained: false,
          hasShip: false,
        }
      );
    }),
  );

  return (
    <Container fluid className="bs-layout-container">
      <Card className="bs-layout-card">
        <div className="bs-board-matrix">
          <div className="bs-axis-corner" />

          {numArr.map((num) => (
            <div key={`num-${num}`} className="bs-axis-cell bs-axis-top">
              <h1>{num}</h1>
            </div>
          ))}

          {finalBoard.map((row, rowIdx) => (
            <React.Fragment key={`row-${rowIdx}`}>
              <div className="bs-axis-cell bs-axis-left">
                <h1>{letterArr[rowIdx]}</h1>
              </div>
              {row.map((cell: Cell) => (
                <div key={cell.id} className="bs-grid-item">
                  <BattleshipCell cell={cell} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </Card>
    </Container>
  );
};

export default BSBoard;
