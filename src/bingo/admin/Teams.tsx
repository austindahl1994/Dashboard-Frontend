import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
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

  const [selectedTeam, setSelectedTeam] = useState<number>(0);

  const prevTeam = () => setSelectedTeam((s) => (s + 2) % 3);
  const nextTeam = () => setSelectedTeam((s) => (s + 1) % 3);

  const teamPlayers = teams[selectedTeam] || [];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px 0",
        height: "100%",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Button
            size="sm"
            variant="primary"
            onClick={prevTeam}
            aria-label="previous team"
          >
            &lt;
          </Button>
          <h5
            style={{ textAlign: "center", margin: 0 }}
          >{`Team ${selectedTeam + 1}`}</h5>
          <Button
            size="sm"
            variant="primary"
            onClick={nextTeam}
            aria-label="next team"
          >
            &gt;
          </Button>
        </div>

        {teamPlayers.length === 0 ? (
          <div style={{ textAlign: "center" }}>No players</div>
        ) : (
          <div
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              height: "95%",
            }}
          >
            <Table
              size="sm"
              bordered
              hover
              style={{
                width: "90%",
                maxWidth: 760,
                margin: "0 auto",
                tableLayout: "auto",
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: "33%" }}>discord</th>
                  <th style={{ width: "33%" }}>nickname</th>
                  <th style={{ width: "33%" }}>rsn</th>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;
