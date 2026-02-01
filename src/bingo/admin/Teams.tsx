import React from "react";
import { Table } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

type Player = {
  sheets_row: number;
  username: string;
  nickname: string;
  rsn: string;
  team: number;
  donation?: number;
};

const Teams: React.FC<{ data?: any }> = ({ data }) => {
  const queryClient = useQueryClient();
  const passcode = localStorage.getItem("passcode") || undefined;

  const source =
    Array.isArray(data) || Array.isArray(data?.data)
      ? data
      : queryClient.getQueryData(["players", passcode]);

  const players: Player[] = Array.isArray(source)
    ? source
    : Array.isArray(source?.data)
      ? source.data
      : [];

  const teams = [1, 2, 3].map((t) => players.filter((p) => p.team === t));

  return (
    <div style={{ display: "flex", gap: 12, padding: "20px 0" }}>
      {teams.map((teamPlayers, idx) => (
        <div key={idx} style={{ flex: 1, minWidth: 200 }}>
          <h5 style={{ textAlign: "center" }}>{`Team ${idx + 1}`}</h5>
          {teamPlayers.length === 0 ? (
            <div style={{ textAlign: "center" }}>No players</div>
          ) : (
            <Table size="sm" bordered hover>
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>discord</th>
                  <th style={{ width: "30%" }}>nickname</th>
                  <th style={{ width: "30%" }}>rsn</th>
                </tr>
              </thead>
              <tbody>
                {teamPlayers.map((p) => (
                  <tr key={`${p.sheets_row}-${p.username}`}>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.username}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.nickname}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.rsn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      ))}
    </div>
  );
};

export default Teams;
