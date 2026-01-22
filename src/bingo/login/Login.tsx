import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getBoard, getTeam } from "../../api";
import { BoardTile } from "../board/Board";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ToastContext } from "../../main-components/ToastContext";

const Login = () => {
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { createToast } = useContext(ToastContext);

  useEffect(() => {
    const saved = localStorage.getItem("passcode");
    if (saved) {
      playerMutation.mutate(saved);
    }
  }, []);
  // Just need to validate team, if validates backend will send completions data back, board called separately
  const playerMutation = useMutation({
    mutationFn: (passcode: string) => {
      // console.log(`Using passcode for mutation: ${passcode}`);
      return getTeam({ passcode });
    },
    onSuccess: (data, passcode: string) => {
      const rsn = data.rsn;
      //{"team":2,"rsn":"ItzDubz","role":"admin"}
      localStorage.setItem("passcode", passcode);
      // Notify same-tab listeners that passcode changed
      try {
        window.dispatchEvent(
          new CustomEvent("passcodeChanged", { detail: { passcode } }),
        );
      } catch (err) {
        console.warn("Could not dispatch passcodeChanged event:", err);
      }
      // If a board is already cached, navigate immediately
      const cached = localStorage.getItem("board");
      if (cached) {
        createToast("Logged in — board loaded from cache", 1);
        navigate("/bingo/board");
        return;
      }

      // Otherwise fetch, cache, and navigate on success
      try {
        queryClient
          .fetchQuery({ queryKey: ["board"], queryFn: getBoard })
          .then((data) => {
            if (data) {
              try {
                localStorage.setItem("board", JSON.stringify(data));
              } catch (err) {
                console.error("Failed to cache board to localStorage:", err);
              }
              createToast(`Welcome to Vinny's bingo ${rsn}!`, 1);
              navigate("/bingo/board");
            }
          })
          .catch((err) => {
            console.error("Error fetching board after login:", err);
            createToast(`Failed to fetch board: ${err?.message ?? err}`, 0);
          });
      } catch (err) {
        console.error("Failed to initiate board fetch:", err);
      }
    },
    onError: (error: any) => {
      console.error("Error fetching player data:", error);
      localStorage.removeItem("passcode");
      createToast(`Login failed: ${error?.message ?? error}`, 0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPasscode.trim() === "") return;
    let finalPasscode = inputPasscode.trim();
    if (inputPasscode.includes("Passcode")) {
      finalPasscode = inputPasscode
        .split("Passcode:")[1]
        .trim()
        .replaceAll("`", "")
        .trim();
    }
    playerMutation.mutate(finalPasscode);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "35rem",
          boxSizing: "border-box",
          margin: "0 1rem",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 8,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          backgroundColor: "lightgray",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Enter Passcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Passcode"
              onChange={(e) => setInputPasscode(e.target.value)}
            />
            <Form.Text className="text-muted text-center">
              Run "/passcode" in ANY Cabbage Discord channel to get your unique
              passcode.
            </Form.Text>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
