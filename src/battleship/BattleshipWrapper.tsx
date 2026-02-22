import React from "react";
import BattleshipBoard from "./BattleshipBoard";
import { useQuery } from "@tanstack/react-query";
import { getBSBoard } from "../api";

const letterArr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const numArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const BattleshipWrapper: React.FC = () => {
  const cachedBSBoard = localStorage.getItem("battleshipBoard");
  const {
    data: board,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["BattleshipBoard"],
    queryFn: getBSBoard,
    retry: false,
    staleTime: 600000,
    refetchOnWindowFocus: false,
    enabled: !cachedBSBoard,
    initialData: cachedBSBoard ? JSON.parse(cachedBSBoard) : undefined,
  });

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading board</div>
      ) : (
        <BattleshipBoard board={board} />
      )}
    </>
  );
};

export default BattleshipWrapper;
