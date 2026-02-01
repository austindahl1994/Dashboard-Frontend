import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { rulesHeaders, rulesData } from "./RulesData";
import "./rules.css";

const Rules: React.FC = () => {
  return (
    <div style={{ marginTop: 20, overflowY: "auto", width: "100%" }}>
      <Container fluid className="p-0">
        <Row>
          {rulesHeaders.map((header, idx) => (
            <Col md={6} sm={12} key={idx} className="p-2">
              <Card className="rule-card h-100">
                <Row className="g-0 rule-row">
                  <Col xs={3} className="rule-number-col">
                    <div className="rule-number">{idx + 1}</div>
                  </Col>
                  <Col xs={9}>
                    <Card.Body>
                      <Card.Title className="rule-header">{header}</Card.Title>
                      <Card.Text className="rule-text">
                        {rulesData[idx]}
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Rules;
