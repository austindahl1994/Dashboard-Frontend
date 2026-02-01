import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getStates } from "../../api";
import { Card } from "react-bootstrap";

type TeamState = {
  teamNumber: number;
  tileCounts?: Record<string, any>;
  completedTiles?: any[];
  rowCounts?: number[];
  colCounts?: number[];
  completedRows?: any[];
  completedCols?: any[];
  tilePoints?: number;
};

const normalizeState = (s: any): TeamState => {
  const toArray = (v: any) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "object") return Object.keys(v);
    return [v];
  };

  return {
    teamNumber: s.teamNumber ?? s.team ?? 0,
    tileCounts:
      s.tileCounts && typeof s.tileCounts === "object"
        ? Array.isArray(s.tileCounts)
          ? Object.fromEntries(s.tileCounts)
          : s.tileCounts
        : {},
    completedTiles: toArray(s.completedTiles),
    rowCounts: Array.isArray(s.rowCounts) ? s.rowCounts : [],
    colCounts: Array.isArray(s.colCounts) ? s.colCounts : [],
    completedRows: toArray(s.completedRows),
    completedCols: toArray(s.completedCols),
    tilePoints: s.tilePoints ?? 0,
  };
};

const States: React.FC<{ data?: any }> = ({ data: propData }) => {
  const passcode = localStorage.getItem("passcode") || undefined;
  const {
    data: fetched,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["states", passcode],
    queryFn: () => getStates({ passcode }),
    enabled: !!passcode && !propData,
  });

  const source = propData ?? fetched;

  const states: TeamState[] = (() => {
    if (!source) return [];
    if (Array.isArray(source)) return source.map(normalizeState);
    if (Array.isArray(source.data)) return source.data.map(normalizeState);
    if (typeof source === "object")
      return Object.values(source).map(normalizeState);
    return [];
  })();

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        flex: 1,
        width: "100%",
        overflow: "auto",
        minHeight: 0,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
      }}
    >
      {isLoading ? (
        <div>Loading states...</div>
      ) : isError ? (
        <div className="text-danger">Failed to load states.</div>
      ) : (
        <>
          {states.length
            ? states.map((s) => (
                <Card
                  key={s.teamNumber}
                  style={{ width: "100%", minWidth: 240 }}
                >
                  <Card.Body>
                    <Card.Title>{`Team ${s.teamNumber}`}</Card.Title>

                    <div style={{ marginTop: 5 }}>
                      <strong>Tile Points:</strong> <span>{s.tilePoints}</span>
                    </div>

                    <div style={{ marginTop: 5 }}>
                      <strong>Tile Counts (unique tiles):</strong>{" "}
                      <span>
                        {s.tileCounts ? Object.keys(s.tileCounts).length : 0}
                      </span>
                    </div>

                    <div style={{ marginTop: 5 }}>
                      <strong>Completed Tiles (count):</strong>{" "}
                      <span>{(s.completedTiles || []).length}</span>
                    </div>

                    <div style={{ marginTop: 5 }}>
                      <strong>Completed Rows (count):</strong>{" "}
                      <span>{(s.completedRows || []).length}</span>
                    </div>

                    <div style={{ marginTop: 5 }}>
                      <strong>Completed Cols (count):</strong>{" "}
                      <span>{(s.completedCols || []).length}</span>
                    </div>

                    <div style={{ marginTop: 5 }}>
                      <strong>Row counts:</strong>
                      <div
                        style={{ fontFamily: "monospace", overflowX: "auto" }}
                      >
                        {(s.rowCounts || []).map((v, i) => (
                          <div key={i}>{`Row ${i + 1}: ${v}`}</div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: 5 }}>
                      <strong>Col counts:</strong>
                      <div
                        style={{ fontFamily: "monospace", overflowX: "auto" }}
                      >
                        {(s.colCounts || []).map((v, i) => (
                          <div key={i}>{`Col ${i + 1}: ${v}`}</div>
                        ))}
                      </div>
                    </div>

                    {s.completedTiles && s.completedTiles.length > 0 && (
                      <div style={{ marginTop: 5 }}>
                        <strong>Completed Tiles List:</strong>
                        <div
                          style={{ fontFamily: "monospace", overflowX: "auto" }}
                        >
                          {s.completedTiles.map((t: any, idx: number) => (
                            <div key={idx}>{t}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {s.completedRows && s.completedRows.length > 0 && (
                      <div style={{ marginTop: 5 }}>
                        <strong>Completed Rows List:</strong>
                        <div
                          style={{ fontFamily: "monospace", overflowX: "auto" }}
                        >
                          {(s.completedRows || []).map(
                            (r: any, idx: number) => (
                              <div key={idx}>{String(r)}</div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {s.completedCols && s.completedCols.length > 0 && (
                      <div style={{ marginTop: 5 }}>
                        <strong>Completed Cols List:</strong>
                        <div
                          style={{ fontFamily: "monospace", overflowX: "auto" }}
                        >
                          {(s.completedCols || []).map(
                            (c: any, idx: number) => (
                              <div key={idx}>{String(c)}</div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              ))
            : // Fallback: show three empty cards for teams 1..3
              [1, 2, 3].map((n) => (
                <Card key={n} style={{ width: "100%", minWidth: 240 }}>
                  <Card.Body>
                    <Card.Title>{`Team ${n}`}</Card.Title>
                    <div>No data</div>
                  </Card.Body>
                </Card>
              ))}
        </>
      )}
    </div>
  );
};

export default States;
