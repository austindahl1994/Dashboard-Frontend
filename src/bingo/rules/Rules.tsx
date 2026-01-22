import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { rulesHeaders, rulesData } from "./RulesData";

const Rules: React.FC = () => {
  return (
    <div style={{ marginTop: 20, overflowY: "auto", width: "100%" }}>
      <style>{`.rules-accordion .accordion-button { background-color: black !important; color: white !important; }
      .rules-accordion .accordion-button:focus { box-shadow: none; }
      `}</style>
      <Accordion defaultActiveKey={"0"} className="rules-accordion">
        {rulesHeaders.map((header, idx) => (
          <Accordion.Item eventKey={String(idx)} key={idx}>
            <Accordion.Header>{header}</Accordion.Header>
            <Accordion.Body>{rulesData[idx]}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Rules;
