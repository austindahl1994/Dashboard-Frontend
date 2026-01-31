import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHighscores } from "../../api";
import { Card, Col, Container, Row } from "react-bootstrap";
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
    deathCounts = {},
    completions: completionMap = {},
  } = data && typeof data === "object" ? (data as any) : {};

  const mapToEntries = (m: Record<string, any>) =>
    Object.entries(m || {}).map(
      ([k, v]) => [Number(k), Number(v)] as [number, number],
    );

  const highscoresEntries = mapToEntries(highscores);
  const deathCountEntries = mapToEntries(deathCounts);
  const completionEntries = mapToEntries(completionMap);
  // if (data) {
  //   console.log(data);
  // }

  // Actual points - 444
  const MAX_POINTS = 444;

  return (
    <>
      {isLoading ? (
        <div>Loading highscores...</div>
      ) : isError ? (
        <div className="text-danger">Failed to load highscores.</div>
      ) : (
        <Container className="p-0 h-100 w-100">
          <Row className="g-3 h-100 w-100">
            <Col md={6} className="p-3">
              <Card className="h-100 hs-main-card">
                <Card.Header className="text-center">Highscores</Card.Header>
                <Card.Body className="overflow-auto">
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
                          <div className="hs-team mt-2 text-white">
                            <strong>Team {team}</strong>
                          </div>
                          <div className="hs-score">{score}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="p-3">
              <Card className="h-100">
                <Card.Header className="text-center">Death Counts</Card.Header>
                <Card.Body>
                  {deathCountEntries.length ? (
                    <ul className="list-unstyled mb-0">
                      {deathCountEntries.map(([team, count]) => (
                        <li key={team}>
                          <strong>Team {team}:</strong> {count}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No data</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="p-3">
              <Card className="h-100">
                <Card.Header className="text-center">
                  Tile Submission Counts
                </Card.Header>
                <Card.Body>
                  {completionEntries.length ? (
                    <ul className="list-unstyled mb-0">
                      {completionEntries.map(([team, count]) => (
                        <li key={team}>
                          <strong>Team {team}:</strong> {count}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No data</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="p-3">
              <Card className="h-100">
                <Card.Header className="text-center">
                  Something else?
                </Card.Header>
                <Card.Body>...</Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Highscores;
