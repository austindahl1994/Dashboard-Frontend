import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHighscores } from "../../api";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import "./highscores.css";

const TEAM_COLORS = ["#1f7a1f", "#5599c5", "#7a3a8a"];

const Highscores: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    if (!passcode) navigate("/bingo/login", { replace: true });
  }, [navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["highscores"],
    queryFn: () => getHighscores(),
  });

  // Expect backend to return: { highscores, deathCounts, completions }
  const {
    highscores = {},
    // deathCounts = {},
    // completions: completionMap = {},
  } = data && typeof data === "object" ? (data as any) : {};

  const mapToEntries = (m: Record<string, any>) =>
    Object.entries(m || {}).map(
      ([k, v]) => [Number(k), Number(v)] as [number, number],
    );

  const highscoresEntries = mapToEntries(highscores);
  // const deathCountEntries = mapToEntries(deathCounts);
  // const completionEntries = mapToEntries(completionMap);
  // const maxSubmission = completionEntries.length
  //   ? Math.max(...completionEntries.map(([, c]) => c))
  //   : 0;
  // if (data) {
  //   console.log(data);
  // }

  // Actual points - 444
  const MAX_POINTS = 444;

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center py-4 text-white">
          <Spinner animation="border" />
        </div>
      ) : data === null ? (
        <div className="text-white">
          These are not the scores you're looking for...
        </div>
      ) : isError ? (
        <div className="text-danger">Failed to load highscores.</div>
      ) : (
        <Container
          fluid
          className="p-0 h-100 w-100 d-flex justify-content-center align-items-center"
        >
          <Row className="g-0 w-100 justify-content-center">
            <Col xs={12} md={10} lg={8} className="p-3">
              {/* <h1 className="text-white text-center p-1">Highscores</h1> */}
              <Card className="hs-main-card" style={{ height: "80vh" }}>
                <Card.Header className="text-center">
                  <h2>Point System</h2>
                </Card.Header>
                <Card.Body className="overflow-auto bg-black d-flex align-items-center justify-content-center">
                  <div className="hs-container d-flex h-100 w-100 align-items-center justify-content-around">
                    {highscoresEntries.map(([team, score]) => {
                      const pct = Math.max(0, Math.min(1, score / MAX_POINTS));
                      const fillPct = Math.round(pct * 100);
                      const color =
                        TEAM_COLORS[(team - 1) % TEAM_COLORS.length] || "#666";

                      return (
                        <div key={team} className="hs-card text-center">
                          <div className="hs-bar-outer">
                            <div className="hs-bar-track">
                              <div
                                className="hs-bar-fill"
                                style={{
                                  height: `${fillPct}%`,
                                  background: color,
                                }}
                              />
                            </div>
                          </div>
                          <div className="hs-score">{score}</div>
                          <div className="hs-team mt-2 text-white">
                            <strong>Team {team}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
                <Card.Footer className="text-center">
                  <p>
                    <strong>
                      Points work as: Easy = 1 point per tile, Medium = 2 points
                      per tile, Hard = 3 points per tile, Elite = 5 points per
                      tile, Master = 8 points per tile. When completing a
                      row/column you will receive 8 points, this works only
                      horizontally and vertically.
                    </strong>
                  </p>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Highscores;
