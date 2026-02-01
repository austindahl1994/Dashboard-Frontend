import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Completions from "./Completions";
import Shames from "./Shames";
import Players from "./Players";
import States from "./States";
import { getPlayers, getStates, getCompletions, getShame } from "../../api";
import { useNavigate } from "react-router";

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/bingo/home", { replace: true });
    }
  }, [navigate]);

  const [team, setTeam] = useState<number | null>(1);
  const [outerTab, setOuterTab] = useState<
    "completions" | "shames" | "players" | "states" | null
  >("completions");
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!outerTab) return;
    setIsFetching(true);
    setFetchError(null);
    try {
      const passcode = localStorage.getItem("passcode");
      let res = null;
      if (outerTab === "players") {
        res = await getPlayers({ passcode });
      } else if (outerTab === "states") {
        res = await getStates({ passcode });
      } else if (outerTab === "completions") {
        res = await getCompletions({ passcode });
      } else if (outerTab === "shames") {
        res = await getShame({ passcode });
      }
      console.log(`Data from server: `);
      console.log(JSON.stringify(res, null, 2));
      setFetchedData(res);
    } catch (err: any) {
      console.error(err);
      setFetchError(err?.message || "Fetch failed");
      setFetchedData(null);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Container className="d-flex w-100 h-100 m-0 p-2 flex-column">
      <div
        className="d-flex mb-3 align-items-center"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-start" }}>
          {["completions", "shames", "players", "states"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`btn ${outerTab === tab ? "btn-primary" : "btn-outline-light"}`}
              onClick={() => {
                setOuterTab(tab as any);
                setTeam(tab === "completions" || tab === "shames" ? 1 : null);
                setFetchedData(null);
                setFetchError(null);
                setIsFetching(false);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <div className="d-flex" style={{ gap: 8 }}>
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                type="button"
                disabled={
                  !(outerTab === "completions" || outerTab === "shames")
                }
                className={`btn ${
                  outerTab === "completions" || outerTab === "shames"
                    ? team === t
                      ? "btn-secondary"
                      : "btn-outline-light"
                    : "btn-outline-light"
                }`}
                onClick={() =>
                  (outerTab === "completions" || outerTab === "shames") &&
                  setTeam(t)
                }
              >
                {`Team ${t}`}
              </button>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={fetchData}
              className={`btn ${
                !outerTab ||
                ((outerTab === "completions" || outerTab === "shames") &&
                  team == null)
                  ? "btn-outline-light"
                  : isFetching
                    ? "btn-primary"
                    : "btn-success"
              }`}
              disabled={
                !outerTab ||
                ((outerTab === "completions" || outerTab === "shames") &&
                  team == null) ||
                isFetching
              }
            >
              {isFetching ? "Fetching..." : "Fetch Data"}
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {outerTab === "completions" && (
          <Completions team={team} data={fetchedData} />
        )}
        {outerTab === "shames" && <Shames team={team} data={fetchedData} />}
        {outerTab === "players" && <Players data={fetchedData} />}
        {outerTab === "states" && <States data={fetchedData} />}
      </div>
    </Container>
  );
};

export default Admin;
