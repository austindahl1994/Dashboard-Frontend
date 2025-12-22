import { FC, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Tile from "./Tile";
import TileModal from "./TileModal";

import { getBoard, getCompletions, getPlayer } from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("passcode");
    if (saved) {
      console.log(`Localstorage contained passcode: ${saved}`);
      playerMutation.mutate(saved);
    } else {
      console.log(`Localstorage did not contain passcode`);
      setShowLogin(true);
    }
  }, []);
  // Just need to validate team, if validates backend will send completions data back, board called separately
  const playerMutation = useMutation({
    mutationFn: (passcode: string) => {
      console.log(`Using passcode for mutation: ${passcode}`);
      return getPlayer({ passcode });
    },
    onSuccess: (_, passcode: string) => {
      localStorage.setItem("passcode", passcode);
      setShowLogin(false);
    },
    onError: (error) => {
      console.error("Error fetching player data:", error);
      localStorage.removeItem("passcode");
      setShowLogin(true);
    },
  });

  const boardQuery = useQuery<BoardTile[]>({
    queryKey: ["board"],
    queryFn: getBoard,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    enabled: !showLogin,
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
        Math.sqrt(boardQuery.data.length)
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPasscode.trim() === "") return;
    playerMutation.mutate(inputPasscode.trim());
  };

  return (
    <>
      {showLogin ? (
        <div>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Enter Passcode</Form.Label>
              <Form.Control
                type="text"
                placeholder="Passcode"
                onChange={(e) => setInputPasscode(e.target.value)}
              />
              <Form.Text className="text-muted">
                Run "/passcode" in Discord to get your unique passcode.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      ) : (
        <>
          {/* Show spinner while board data is loading */}
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
