import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Container from "react-bootstrap/Container";

import "./Footer.css";

export default function Footer() {
  return (
    <Container className="footer" fluid>
      <Row className="justify-content-md-center">
        <Col md="auto" className="m-0">
          <h1>Investment Portfolio Tracker</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="m-1">
          <h2>Do the things you do, but better! </h2>
        </Col>
      </Row>
    </Container>
  );
}
