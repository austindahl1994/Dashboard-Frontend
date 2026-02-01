import React from "react";
import { Table } from "react-bootstrap";

export interface Player {
  sheets_row: number;
  username: string;
  nickname: string;
  rsn: string;
  team: number;
  paid?: boolean;
  donation: number;
}

type PlayersProps = {
  data?: Player[] | { data?: Player[] };
};

const Players: React.FC<PlayersProps> = ({ data }) => {
  const isLoading = false;
  const isError = false;

  const players: Player[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data!.data!
      : [];

  const formatOSRSGold = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    if (n === 0) return "-";
    if (n < 1000) return `${n}M`;
    // For values >= 1000, keep using M but insert commas (e.g. 1500 -> "1,500M")
    return `${n.toLocaleString()}M`;
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        flex: 1,
        width: "100%",
        overflow: "auto",
        minHeight: 0,
      }}
    >
      <h3 className="text-center">Players</h3>
      {isLoading ? (
        <div>Loading players...</div>
      ) : isError ? (
        <div className="text-danger">Failed to load players.</div>
      ) : (
        <Table
          responsive="sm"
          bordered
          hover
          size="sm"
          style={{ tableLayout: "fixed", textAlign: "center" }}
        >
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead>
            <tr>
              <th />
              <th style={{ whiteSpace: "nowrap" }}>discord</th>
              <th style={{ whiteSpace: "nowrap" }}>nickname</th>
              <th style={{ whiteSpace: "nowrap" }}>rsn</th>
              <th style={{ whiteSpace: "nowrap" }}>team</th>
              <th style={{ whiteSpace: "nowrap" }}>donation</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0
              ? null
              : players.map((p) => (
                  <tr key={`${p.sheets_row}-${p.username}`}>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p?.sheets_row ?? "-"}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p?.username ?? "-"}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p?.nickname ?? "-"}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p?.rsn ?? "-"}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p?.team ?? "-"}
                    </td>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatOSRSGold(p?.donation)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Players;
