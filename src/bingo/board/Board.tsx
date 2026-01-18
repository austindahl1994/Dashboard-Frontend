import { FC, useEffect, useState } from "react";
import { Col, Container, Row, Spinner, ListGroup, Form } from "react-bootstrap";
import Tile from "./Tile";
import TileModal from "./TileModal";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getBoard } from "../../api";

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
export interface Player {
  rsn: string;
  team: number;
  discord: string;
}

const Board: FC = () => {
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [boardArray, setBoardArray] = useState<BoardTile[] | null>(() => {
    const boardJson = localStorage.getItem("board");
    return boardJson ? (JSON.parse(boardJson) as BoardTile[]) : null;
  });
  const [isLoadingBoard, setIsLoadingBoard] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  );
  const [selectedTier, setSelectedTier] = useState<number>(1);

  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

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

  const finalBoard: BoardTile[][] = boardArray
    ? chunkArray(
        [...boardArray].sort((obj1, obj2) => obj1.id - obj2.id),
        Math.sqrt(boardArray.length),
      )
    : [];

  useEffect(() => {
    // If we already have a board, nothing to do
    if (boardArray) return;

    const passcode = localStorage.getItem("passcode");
    // If there's no passcode and no board, route to bingo home
    if (!passcode) {
      navigate("/bingo");
      return;
    }

    // Passcode exists but no board cached: fetch board using QueryClient
    setIsLoadingBoard(true);
    queryClient
      .fetchQuery({ queryKey: ["board"], queryFn: getBoard })
      .then((data) => {
        if (data) {
          try {
            localStorage.setItem("board", JSON.stringify(data));
          } catch (err) {
            console.error("Failed to cache board to localStorage:", err);
          }
          setBoardArray(data as BoardTile[]);
        }
      })
      .catch((err) => {
        console.error("Error fetching board in Board component:", err);
        navigate("/bingo/login");
      })
      .finally(() => setIsLoadingBoard(false));
  }, [boardArray, navigate, queryClient]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* Show spinner while board data is not yet available in the query cache */}
      {!boardArray || isLoadingBoard ? (
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {isMobile ? (
            <Container
              className="p-2 h-100 text-white"
              style={{ backgroundColor: "rgb(55,55,55)", overflowY: "auto" }}
            >
              <Form.Group>
                <Form.Label>Select Tier</Form.Label>
                <Form.Select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(Number(e.target.value))}
                >
                  <option value={1}>Tier 1 — Easy</option>
                  <option value={2}>Tier 2 — Medium</option>
                  <option value={3}>Tier 3 — Hard</option>
                  <option value={4}>Tier 4 — Elite</option>
                  <option value={5}>Tier 5 — Master</option>
                </Form.Select>
              </Form.Group>

              <ListGroup className="mt-3">
                {boardArray
                  .filter((t) => t.tier === selectedTier)
                  .map((tile) => (
                    <ListGroup.Item
                      key={tile.id}
                      action
                      onClick={() => setSelectedTile(tile)}
                      style={{
                        backgroundColor: getColor(tile.tier),
                        color: "white",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: "0 0 25%", paddingRight: 8 }}>
                          <img
                            src={tile.url}
                            alt={tile.title}
                            style={{
                              width: "100%",
                              height: 48,
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </div>
                        <div
                          style={{ flex: "1 1 75%", wordBreak: "break-word" }}
                        >
                          {tile.title}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Container>
          ) : (
            <Container
              className="p-0 m-0 justify-content-evenly"
              style={{ backgroundColor: "rgb(55,55,55)" }}
            >
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
                      <Tile
                        {...tile}
                        setSelectedTile={setSelectedTile}
                        getColor={getColor}
                      />
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
          )}
        </>
      )}

      {/* Tile modal */}
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
