import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Completions from "./Completions";
import Shames from "./Shames";
import Players from "./Players";
import Teams from "./Teams";
import States from "./States";
import Settings from "./Settings";
import { getPlayers, getStates, getCompletions, getShame } from "../../api";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
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
    | "completions"
    | "shames"
    | "players"
    | "teams"
    | "states"
    | "settings"
    | null
  >("completions");
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const fetchData = async () => {
    if (!outerTab) return;
    setIsFetching(true);
    setFetchError(null);
    try {
      const passcode = localStorage.getItem("passcode");
      let res = null;

      if (outerTab === "players") {
        const key = ["players", passcode];
        res = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => getPlayers({ passcode }),
        });
      } else if (outerTab === "teams") {
        // teams use players data
        const key = ["players", passcode];
        res = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => getPlayers({ passcode }),
        });
      } else if (outerTab === "states") {
        const key = ["states", passcode];
        res = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => getStates({ passcode }),
        });
      } else if (outerTab === "completions") {
        const key = ["completions", passcode, team ?? "all"];
        res = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () =>
            getCompletions({ passcode, adminTeam: team ?? undefined } as any),
        });
      } else if (outerTab === "shames") {
        const key = ["shames", passcode, team ?? "all"];
        res = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () =>
            getShame({ passcode, adminTeam: team ?? undefined } as any),
        });
      }

      // console.log(`Data from server: `);
      // console.log(JSON.stringify(res, null, 2));
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
          {[
            "completions",
            "shames",
            "players",
            "teams",
            "states",
            "settings",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`btn ${outerTab === tab ? "btn-primary" : "btn-outline-light"}`}
              onClick={() => {
                const defaultTeam =
                  tab === "completions" || tab === "shames" ? 1 : null;
                setOuterTab(tab as any);
                setTeam(defaultTeam);
                setFetchError(null);
                setIsFetching(false);

                const passcode = localStorage.getItem("passcode");
                let key: any = null;
                if (tab === "players") key = ["players", passcode];
                else if (tab === "states") key = ["states", passcode];
                else if (tab === "completions")
                  key = ["completions", passcode, defaultTeam ?? "all"];
                else if (tab === "shames")
                  key = ["shames", passcode, defaultTeam ?? "all"];
                else if (tab === "teams") key = ["players", passcode];
                else if (tab === "settings") key = null;

                const cached = key
                  ? queryClient.getQueryData(key as any)
                  : null;
                setFetchedData(cached ?? null);
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
                onClick={() => {
                  if (!(outerTab === "completions" || outerTab === "shames"))
                    return;
                  const passcode = localStorage.getItem("passcode");
                  const key =
                    outerTab === "completions"
                      ? ["completions", passcode, t ?? "all"]
                      : ["shames", passcode, t ?? "all"];
                  const cached = queryClient.getQueryData(key as any);
                  setTeam(t);
                  setFetchedData(cached ?? null);
                }}
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
                outerTab === "settings" ||
                ((outerTab === "completions" || outerTab === "shames") &&
                  team == null)
                  ? "btn-outline-light"
                  : isFetching
                    ? "btn-primary"
                    : "btn-success"
              }`}
              disabled={
                !outerTab ||
                outerTab === "settings" ||
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
        {outerTab === "teams" && <Teams data={fetchedData} />}
        {outerTab === "states" && <States data={fetchedData} />}
        {outerTab === "settings" && <Settings />}
      </div>
    </Container>
  );
};

export default Admin;
