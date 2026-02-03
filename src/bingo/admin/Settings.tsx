import React, { useState, useContext } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { adminRefresh } from "../../api";
import { ToastContext } from "../../main-components/ToastContext";

const Settings = () => {
  const queryClient = useQueryClient();
  const [refreshingMap, setRefreshingMap] = useState<Record<string, boolean>>(
    {},
  );
  const { createToast } = useContext(ToastContext);

  const doAdminRefresh = async (targets: string[]) => {
    const key = targets.join(",");
    setRefreshingMap((s) => ({ ...s, [key]: true }));
    try {
      const passcode = localStorage.getItem("passcode");
      await adminRefresh({ passcode, targets: targets[0] });

      const passcodeKey = passcode;
      for (const t of targets) {
        if (t === "players")
          await queryClient.invalidateQueries({
            queryKey: ["players", passcodeKey],
          });
        else if (t === "board")
          await queryClient.invalidateQueries({ queryKey: ["board"] });
        else if (t === "states" || t === "teamStates")
          await queryClient.invalidateQueries({
            queryKey: ["states", passcodeKey],
          });
        else if (t === "completions")
          await queryClient.invalidateQueries({
            queryKey: ["completions", passcodeKey],
          });
        else if (t === "shames")
          await queryClient.invalidateQueries({
            queryKey: ["shames", passcodeKey],
          });
        else if (t === "all") {
          await queryClient.invalidateQueries();
        }
      }
      // success toast - make message specific to the action
      const t0 = targets[0];
      let okMsg = "Refreshed";
      if (t0 === "players") okMsg = "Players refreshed";
      else if (t0 === "board") okMsg = "Board refreshed";
      else if (t0 === "teamStates") okMsg = "Team states refreshed";
      else if (t0 === "completions") okMsg = "Completions refreshed";
      else if (t0 === "shames") okMsg = "Shames refreshed";
      else if (t0 === "all") okMsg = "All data refreshed";
      createToast && createToast(okMsg, 1);
    } catch (err) {
      console.error(err);
      const msg = (err as any)?.message || "Refresh failed";
      // error toast - specific if possible
      const t0 = targets[0];
      let errPrefix = "Refresh failed";
      if (t0 === "players") errPrefix = "Players refresh failed";
      else if (t0 === "board") errPrefix = "Board refresh failed";
      else if (t0 === "teamStates") errPrefix = "Team states refresh failed";
      else if (t0 === "completions") errPrefix = "Completions refresh failed";
      else if (t0 === "shames") errPrefix = "Shames refresh failed";
      else if (t0 === "all") errPrefix = "Full refresh failed";
      createToast && createToast(`${errPrefix}: ${msg}`, 0);
    } finally {
      setRefreshingMap((s) => ({ ...s, [key]: false }));
    }
  };

  const cards = [
    { title: "Refresh Players", targets: ["players"] },
    { title: "Refresh Board", targets: ["board"] },
    { title: "Refresh Points", targets: ["teamStates"] },
    { title: "Refresh Completions", targets: ["completions"] },
    { title: "Refresh All", targets: ["all"] },
  ];

  const descriptions = [
    "After making any changes to the google sheet players tab manually, click this to refresh the players data.",
    "If you have made changes to the bingo board tab on google sheets, click this to refresh the board data.",
    "If scores are not displayed correctly, or think they are innacurate, click this to refresh team states used for point scoring.",
    "If completions are not showing correctly or are missing any, click this to refresh the completions data.",
    "If multiple things aren't working properly, or you just want to be sure everything is up to date, click this to refresh all data.",
  ];

  return (
    <Row xs={1} md={2} lg={3} className="g-3">
      {cards.map((c, index) => {
        const key = c.targets.join(",");
        const refreshing = !!refreshingMap[key];
        return (
          <Col key={key}>
            <Card>
              <Card.Header className="text-center">
                <h4>{c.title}</h4>
              </Card.Header>
              <Card.Body style={{ minHeight: 80 }}>
                {descriptions[index]}
              </Card.Body>
              <Card.Footer className="text-center">
                <Button
                  variant="danger"
                  onClick={() => doAdminRefresh(c.targets)}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Refreshing...
                    </>
                  ) : (
                    "REFRESH"
                  )}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default Settings;
