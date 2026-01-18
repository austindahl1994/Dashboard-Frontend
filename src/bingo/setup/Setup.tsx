import React, { useState, useContext } from "react";
import { Button, ListGroup, Form } from "react-bootstrap";
import dinkSetup from "./dinkSetup.json";
import { ToastContext } from "../../main-components/ToastContext";

const Setup = () => {
  const { createToast } = useContext(ToastContext);

  const handleCopy = async () => {
    try {
      console.log(`Clicked handleCopy`);
      const text = JSON.stringify(dinkSetup);
      await navigator.clipboard.writeText(text);
      createToast("Copied Dink Settings to clipboard", 1);
    } catch (err) {
      console.error(err);
      createToast("Failed to copy Dink Settings to clipboard", 0);
    }
  };

  const steps: React.ReactNode[] = [
    "Download Dink plugin if you don't have it, then turn it on.",
    <>
      If you've used dink before, in game chat type{" "}
      <strong>::dinkexport all</strong> and paste your current settings
      somewhere to save them.
    </>,
    "Go into Dink plugin, at the bottom click Reset.",
    "Click the button below to copy the new setup to your clipboard.",
    <>
      In game, type <strong>::dinkimport</strong> to import the new setup.
    </>,
    "Exit the dink plugin then go back in, checking that there is a webhook URL at the top of your dink settings.",
  ];

  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean[]>(
    Array(steps.length).fill(false),
  );

  const handleToggle = (idx: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
    // reveal next instruction when this one is checked
    if (idx + 1 > visibleCount - 1) {
      setVisibleCount((v) => Math.max(v, idx + 2));
    }
  };

  return (
    <div className="text-white">
      <h2>Setup</h2>
      <h4>Temp Dink setup instructions:</h4>
      <ListGroup>
        {steps.slice(0, visibleCount).map((text, idx) => (
          <ListGroup.Item
            key={idx}
            className="d-flex align-items-start"
            style={{
              backgroundColor: completed[idx]
                ? "rgba(0,128,0,0.12)"
                : undefined,
            }}
          >
            <Form.Check
              type="checkbox"
              id={`setup-step-${idx}`}
              checked={completed[idx]}
              onChange={() => handleToggle(idx)}
              className="me-2"
            />
            <div>
              {idx === 3 ? (
                // step with the copy button inline
                <>
                  <div style={{ marginBottom: 8 }}>{text}</div>
                  <div>
                    <Button onClick={handleCopy}>
                      Copy dinkSetup to clipboard
                    </Button>
                  </div>
                </>
              ) : (
                <div>{text}</div>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h6 className="my-2">Need WOM/Clan events setup as well?</h6>
      <h6 className="my-2">Need videos for illiterate folks as well?</h6>
    </div>
  );
};

export default Setup;
