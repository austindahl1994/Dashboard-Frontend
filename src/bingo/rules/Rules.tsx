import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { rulesHeaders, rulesData } from "./RulesData";

const Rules: React.FC = () => {
  return (
    <div style={{ marginTop: 20 }}>
      <Accordion defaultActiveKey={"0"}>
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
