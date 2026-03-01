import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHighscores } from "../../api";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import "./highscores.css";
import EventCountdown from "../board/EventCountdown";

const TEAM_COLORS = ["chartreuse", "fuchsia", "green"];

const Highscores: React.FC = () => {
  const navigate = useNavigate();

  // Cutoff: Feb 28 2026 08:00 CST (UTC-6) => 2026-02-28T14:00:00Z
  const cutoff = new Date(Date.UTC(2026, 1, 28, 14, 0, 0));
  const isBeforeCutoff = Date.now() < cutoff.getTime();

  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    if (!passcode && !isBeforeCutoff)
      navigate("/bingo/login", { replace: true });
  }, [navigate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["highscores"],
    queryFn: () => getHighscores(),
    enabled: !isBeforeCutoff,
  });

  // Expect backend to return: { highscores, deathCounts, completions }
  const {
    highscores = {},
    deathCounts = {},
    completions = {},
  } = data && typeof data === "object" ? (data as any) : {};

  const mapToEntries = (m: Record<string, any>) =>
    Object.entries(m || {}).map(
      ([k, v]) => [Number(k), Number(v)] as [number, number],
    );

  const highscoresEntries = mapToEntries(highscores);
  const deathEntries = mapToEntries(deathCounts);
  const completionEntries = mapToEntries(completions);
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

  const getTeam = (teamNum: number): string => {
    switch (teamNum) {
      case 1:
        return "Team <3";
      case 2:
        return "Team 3";
      case 3:
        return "Team :3";
      default:
        return teamNum.toString();
    }
  };

  const TopDeaths: React.FC = () => {
    const [entries, setEntries] = useState<[string, number][]>([]);

    useEffect(() => {
      try {
        const raw = localStorage.getItem("deathCounts");
        if (!raw) {
          setEntries([]);
          return;
        }
        const obj = JSON.parse(raw || "{}");
        const arr = Object.entries(obj || {}).map(
          ([k, v]) => [k, Number(v || 0)] as [string, number],
        );
        arr.sort((a, b) => b[1] - a[1]);
        setEntries(arr.slice(0, 5));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to read deathCounts from localStorage", err);
        setEntries([]);
      }
    }, []);

    if (!entries.length) return <div className="text-white">No death data</div>;

    return (
      <div className="death-container d-flex flex-column w-100">
        {entries.map(([name, count]) => (
          <div
            key={name}
            className="death-item d-flex align-items-center justify-content-start"
            style={{ minWidth: 0 }}
          >
            <div className="death-count" style={{ fontSize: "2rem" }}>
              {count}
            </div>
            <div style={{ width: 12 }} />
            <div className="death-team">{name}</div>
          </div>
        ))}
      </div>
    );
  };

  return isBeforeCutoff ? (
    <EventCountdown />
  ) : (
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
        <Container fluid className="p-0 h-100 w-100 d-flex flex-column">
          <div className="hs-grid-root" style={{ height: "100%" }}>
            <div className="hs-row">
              <Card className="hs-main-card">
                <Card.Header className="text-center">
                  <h2>Points</h2>
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
                            <strong>{getTeam(Number(team))}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
                {/* Footer moved to rules: see RulesData.tsx */}
              </Card>

              <Card className="death-card">
                <Card.Header className="text-center">
                  <h2>Death Counts</h2>
                </Card.Header>
                <Card.Body className="overflow-auto bg-black d-flex align-items-center justify-content-center">
                  <div className="hs-container d-flex h-100 w-100 align-items-center justify-content-around">
                    {deathEntries.map(([team, count]) => {
                      const max = deathEntries.length
                        ? Math.max(...deathEntries.map(([, c]) => c))
                        : 1;
                      const pct = max
                        ? Math.max(0, Math.min(1, count / max))
                        : 0;
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
                          <div className="hs-score">{count}</div>
                          <div className="hs-team mt-2 text-white">
                            <strong>{getTeam(Number(team))}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div className="hs-row">
              <Card className="submission-card">
                <Card.Header className="text-center">
                  <h2>Submissions</h2>
                </Card.Header>
                <Card.Body className="overflow-auto bg-black d-flex align-items-center justify-content-center">
                  <div className="hs-container d-flex h-100 w-100 align-items-center justify-content-around">
                    {completionEntries.map(([team, count]) => {
                      const max = completionEntries.length
                        ? Math.max(...completionEntries.map(([, c]) => c))
                        : 1;
                      const pct = max
                        ? Math.max(0, Math.min(1, count / max))
                        : 0;
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
                          <div className="hs-score">{count}</div>
                          <div className="hs-team mt-2 text-white">
                            <strong>{getTeam(Number(team))}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>

              <Card className="other-card">
                <Card.Header className="text-center">
                  <h2>Other Stats</h2>
                </Card.Header>
                <Card.Body className="overflow-auto bg-black text-white">
                  <TopDeaths />
                </Card.Body>
              </Card>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};

export default Highscores;
