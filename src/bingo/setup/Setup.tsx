import React, { useState, useContext } from "react";
import { Button, ListGroup, Form, Tabs, Tab } from "react-bootstrap";
import dinkSetup from "./dinkSetup.json";
import { ToastContext } from "../../main-components/ToastContext";
import "./setup.css";

const Setup = () => {
  const { createToast } = useContext(ToastContext);

  const handleCopy = async () => {
    try {
      // console.log(`Clicked handleCopy`);
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

  const [completed, setCompleted] = useState<boolean[]>(
    Array(steps.length).fill(false),
  );

  const handleToggle = (idx: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="setup-root text-white w-100 overflow-auto">
      <Tabs
        defaultActiveKey="dink"
        id="setup-tabs"
        className="setup-tabs w-100"
      >
        <Tab eventKey="dink" title="Dink Setup" className="setup-card">
          <div className="setup-card-body overflow-auto">
            <ListGroup>
              {steps.map((text, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="d-flex align-items-start"
                  style={{
                    backgroundColor: completed[idx]
                      ? "rgba(0,128,0,0.25)"
                      : undefined,
                    color: completed[idx] ? "#ffffff" : undefined,
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
          </div>
        </Tab>

        <Tab eventKey="illiterate" title="I Can't Read" className="setup-card">
          <div className="p-0 d-flex flex-column">
            <div className="flex-fill video-placeholder d-flex align-items-center justify-content-center h-75">
              <video
                className="setup-video"
                src="https://cabbage-bounty.s3.us-east-2.amazonaws.com/bingo/Plugin+Setup+Vid.mp4"
                controls
              />
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Setup;
