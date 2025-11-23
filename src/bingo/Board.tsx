import { FC, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
      {" "}
      {!boardQuery.isSuccess ? (
        <h1>NO BOARD DATA!</h1>
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
          {/* {gridArr.map((_, rowIndex) => (
            <Row
              key={rowIndex}
              className="d-flex justify-content-evenly p-0 m-0 w-100 h-100 overflow-hidden"
            >
              {gridArr.map((_, colIndex) => (
                <Col
                  key={colIndex}
                  className="d-flex justify-content-center align-items-center m-0 p-0"
                >
                  <Tile
                    {...FakeData[rowIndex * BOARD_DIMENSION + colIndex]}
                    setSelectedTile={setSelectedTile}
                  />
                </Col>
              ))}
            </Row>
          ))} */}
        </Container>
      )}
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
          completed={3}
        />
      )}
    </>
  );
};

const images: string[] = [
  "https://oldschool.runescape.wiki/images/Chambers_of_Xeric_logo.png",
  "https://oldschool.runescape.wiki/images/Theatre_of_Blood_logo.png?e6e68",
  "https://oldschool.runescape.wiki/images/Flippers_detail.png?d3492",
  "https://oldschool.runescape.wiki/images/Bandos_tassets_detail.png?abaeb",
  "https://oldschool.runescape.wiki/images/Runecraft_icon_%28detail%29.png?a4903",
  "https://oldschool.runescape.wiki/images/Scythe_of_vitur_detail.png?939b9",
  "https://oldschool.runescape.wiki/images/Armadyl_crossbow_detail.png?de091",
  "https://oldschool.runescape.wiki/images/Lobstrosity.png",
  "https://oldschool.runescape.wiki/images/Tumeken%27s_shadow_detail.png",
  "https://oldschool.runescape.wiki/images/Inquisitor%27s_mace_detail.png",
  "https://oldschool.runescape.wiki/images/Tonalztics_of_ralos_detail.png",
  "https://oldschool.runescape.wiki/images/Torva_armour_set_detail.png",
  "https://oldschool.runescape.wiki/images/Zenyte_shard_detail.png?c5a63",
  "https://oldschool.runescape.wiki/images/Soulflame_horn_detail.png?4fb4d",
  "https://oldschool.runescape.wiki/images/Anvil.png",
  "https://oldschool.runescape.wiki/images/Dragon_claws_detail.png?bdc25",
  "https://oldschool.runescape.wiki/images/Voidwaker_detail.png?01835",
  "https://oldschool.runescape.wiki/images/Draconic_visage_detail.png?6edab",
  "https://oldschool.runescape.wiki/images/Bruma_torch_detail.png?8793d",
  "https://oldschool.runescape.wiki/images/Woodcutting_icon_%28detail%29.png?a4903",
  "https://oldschool.runescape.wiki/images/Callisto.png?bfba7",
  "https://oldschool.runescape.wiki/images/Craw%27s_bow_%28u%29_detail.png",
  "https://oldschool.runescape.wiki/images/Sunfire_fanatic_armour_set_detail.png",
  "https://oldschool.runescape.wiki/images/Wooden_shield_detail.png",
  "https://oldschool.runescape.wiki/images/Ultor_ring_detail.png?784a8",
  "https://oldschool.runescape.wiki/images/Reward_casket_%28master%29_detail.png?2271d",
];

// const FakeData: Tile[] = [];

export default Board;

// const gridArr: undefined[] = Array.from<undefined>({
//   length: BOARD_DIMENSION,
// });

// Array.from({ length: 100 }).forEach((_, rowIndex) => {
//   FakeData.push(generateFakeTile());
// });

//Toughts - have the board be a separate component, so that we can have other parts added as well, like sidebar, player data, etc

// const generateFakeTile = (): Tile => {
//   return {
//     title: "Sample Tile",
//     url: images[Math.floor(Math.random() * images.length)],
//     tier: Math.ceil(Math.random() * 5),
//     notes:
//       "You *MUST* get the drop from a cabbage. Nothing else is accesptabled, unless you bribe Vinny with some money. Man's gotta make his money back from this event somehow.",
//     quantity: Math.floor(Math.random() * 5) + 5,
//     completed: Math.floor(Math.random() * 10),
//   };
// };

// const fakeTile = {
//   title: "Sample Tile",
//   url: "https://oldschool.runescape.wiki/images/Cabbage_detail.png?08f34",
//   tier: 1,
//   notes:
//     "You <strong>MUST</strong> get the drop from a cabbage. Nothing else is accesptabled, unless you bribe Vinny with some money. Man's gotta make his money back from this event somehow.",
//   quantity: 10,
//   completed: 5,
// };
