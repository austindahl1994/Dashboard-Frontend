import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

export interface Shame {
  playerName: string;
  pvp: 0 | 1;
  killer: string | null;
  url: string;
  team: number;
}

const Shames: React.FC<{ team?: number | null; data?: any }> = ({
  team = null,
  data,
}) => {
  const queryClient = useQueryClient();
  const shamesProp: Shame[] | null = Array.isArray(data) ? data : null;
  const [shames, setShames] = useState<Shame[] | null>(shamesProp);

  useEffect(() => setShames(shamesProp), [shamesProp]);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px 0",
        flex: 1,
        width: "100%",
        overflow: "auto",
        minHeight: 0,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>Shames</strong>
        <div style={{ marginLeft: 12 }}>
          {team ? `Team ${team}` : "All teams"}
        </div>
      </div>

      {!shames && (
        <div style={{ marginTop: 12 }}>
          No data. Click "Fetch Data" in Admin.
        </div>
      )}

      {shames && (
        <div style={{ marginTop: 12 }}>
          <div>Returned: {shames.length} shames</div>
          <Table
            size="sm"
            bordered
            hover
            style={{ marginTop: 8, marginLeft: 0, marginRight: 0 }}
          >
            <thead>
              <tr>
                <th>RSN</th>
                <th>Pvp</th>
                <th>Killer</th>
                <th>URL</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {shames.map((s, i) => (
                <tr key={`${s.playerName}-${s.team}-${i}`}>
                  <td>{s.playerName}</td>
                  <td>{s.pvp === 1 ? "True" : "False"}</td>
                  <td>{s.killer ?? "Unknown"}</td>
                  <td>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        View Shame
                      </a>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{s.team}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Shames;
