import { FC, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Tile from "./Tile";
import TileModal from "./TileModal";

import { getBoard } from "../api";
import { useQuery } from "@tanstack/react-query";

const BOARD_DIMENSION = 10;

export interface BoardTile {
  id: number;
  title: string;
  description: string;
  source: string; //update for array
  items: string[];
  tier: number;
  quantity: number;
  url: string;
}
// {
//     id: 46,
//     title: 'obtain one corp sigil',
//     description: 'get a sigil from corp',
//     source: '',
//     items: [ 'Spectral Sigil', 'Arcane Sigil', 'Elysian Sigil' ],
//     tier: 5,
//     quantity: 1,
//     url: 'https://oldschool.runescape.wiki/images/corporeal_beast.png?52ebb'
//   },

const Board: FC = () => {
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const boardQuery = useQuery<BoardTile[]>({
    queryKey: ["board"],
    queryFn: getBoard,
    staleTime: 600000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
  });

  if (boardQuery.isSuccess) {
    console.log("Board data:", boardQuery.data);
  }

  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const finalBoard: BoardTile[][] = boardQuery.data
    ? chunkArray(
        boardQuery.data.sort((obj1, obj2) => obj1.id - obj2.id),
        10
      )
    : [];

  return (
    <>
      {/* Wait for API call for board */}
      {!boardQuery.isSuccess ? (
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Container className="p-0 m-0 justify-content-evenly">
          {finalBoard.map((partialBoard, rowIndex) => (
            <Row
              key={rowIndex}
              className="d-flex justify-content-evenly p-0 m-0 w-100 h-100 overflow-hidden"
            >
              {partialBoard.map((tile: BoardTile, colIndex) => (
                <Col
                  key={colIndex}
                  className="d-flex justify-content-center align-items-center m-0 p-0"
                >
                  <Tile {...tile} setSelectedTile={setSelectedTile} />
                </Col>
              ))}
            </Row>
          ))}
        </Container>
      )}
      {/* Once clicked, show the selected tile in modal */}
      {selectedTile && (
        <TileModal
          show={!!selectedTile}
          handleClose={() => setSelectedTile(null)}
          title={selectedTile.title}
          url={selectedTile.url}
          tier={selectedTile.tier}
          source={selectedTile.source}
          items={selectedTile.items}
          notes={selectedTile.description}
          quantity={selectedTile.quantity}
          completed={0}
        />
      )}
    </>
  );
};

export default Board;
