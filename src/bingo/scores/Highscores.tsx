import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getHighscores } from "../../api";
import { Card } from "react-bootstrap";
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

  // Normalize to array of [teamNumber, score]
  const entries: [number, number][] = (() => {
    if (!data) return [];
    if (Array.isArray(data))
      return data.map(([k, v]: any) => [Number(k), Number(v)]);
    if (typeof data === "object")
      return Object.entries(data).map(([k, v]) => [Number(k), Number(v)]);
    return [];
  })();

  const MAX_POINTS = 444;

  return (
    <div className="text-white highscores-root">
      <h2>Highscores</h2>
      {isLoading ? (
        <div>Loading highscores...</div>
      ) : isError ? (
        <div className="text-danger">Failed to load highscores.</div>
      ) : (
        <div className="hs-container">
          {entries.map(([team, score]) => {
            const pct = Math.max(0, Math.min(1, score / MAX_POINTS));
            const heightPx = 150; // full height for MAX_POINTS
            const fillHeight = Math.round(pct * heightPx);
            const color =
              TEAM_COLORS[(team - 1) % TEAM_COLORS.length] || "#666";

            return (
              <Card key={team} className="hs-card">
                <Card.Body className="hs-card-body">
                  <div className="hs-bar-outer" style={{ height: heightPx }}>
                    <div className="hs-bar-track" style={{ height: heightPx }}>
                      <div
                        className="hs-bar-fill"
                        style={{ height: `${fillHeight}px`, background: color }}
                      />
                    </div>
                  </div>
                  <div className="hs-team">
                    <strong>Team {team}</strong>
                  </div>
                  <div className="hs-score">{score}</div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Highscores;
