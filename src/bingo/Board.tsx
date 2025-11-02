import { FC } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Tile from "./Tile";

const BOARD_DIMENSION = 5;

const Board: FC = () => {
  const gridArr: undefined[] = Array.from<undefined>({
    length: BOARD_DIMENSION,
  });

  images.forEach(() => {
    const randomNumber = Math.floor(Math.random() * 101);
    randomCompletions.push(randomNumber > 77);
  });

  return (
    <Container className="border p-0 m-0 justify-content-evenly">
      {gridArr.map((_, rowIndex) => (
        <Row
          key={rowIndex}
          className="d-flex justify-content-evenly p-0 m-1 w-100 h-100 overflow-hidden"
        >
          {gridArr.map((_, colIndex) => (
            <Col
              key={colIndex}
              xs={2}
              className="d-flex justify-content-center align-items-center m-0 p-0"
            >
              {/* <p className="border m-0 p-0 h-100 w-100">
                {rowIndex * BOARD_DIMENSION + colIndex + 1}
              </p> */}

              <Tile
                url={images[rowIndex * BOARD_DIMENSION + colIndex]}
                completed={
                  randomCompletions[rowIndex * BOARD_DIMENSION + colIndex]
                }
              />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
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
];

const randomCompletions: boolean[] = [];

export default Board;
//Toughts - have the board be a separate component, so that we can have other parts added as well, like sidebar, player data, etc
