import { Spinner as ReactSpinner, Row } from "react-bootstrap";
import React from "react";

export default function Spinner() {
  return (
    <Row className="justify-content-md-center row">
      <ReactSpinner
        animation="border"
        role="status"
        style={{ width: "5rem", height: "5rem" }}
        variant="primary"
      >
        <span className="visually-hidden">Loading...</span>
      </ReactSpinner>
    </Row>
  );
}
