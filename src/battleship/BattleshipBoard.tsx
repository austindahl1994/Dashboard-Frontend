import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getBSBoard } from "../api";
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

interface Cell {
  coord: string;
  id: number;
  url?: string;
  isHit: boolean;
  obtained: boolean;
}

interface BSBoardProps {
  board: Cell[];
}

const BSBoard: React.FC<BSBoardProps> = ({ board }) => {
  return (
    <>
      <h1>Battleship Board</h1>
    </>
  );
};

export default BSBoard;
