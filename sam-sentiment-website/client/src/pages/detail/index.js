/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import StockTable from "../../components/StockTable";
import StockChart from "../../components/StockChart";
import StockSentiment from "../../components/StockSentiment";
import StockTwitter from "../../components/StockTwitter";
import StockFeed from "../../components/StockFeed";

export default function Detail() {
  const location = useLocation();
  const [symbol, setSymbol] = useState(null);

  useEffect(() => {
    let symbol = location.state?.symbol;
    setSymbol(symbol);
  }, [location]);

  if (symbol === null) return <>Loading</>;

  return (
    <Container>
      <Row xs={1} md={2} className="g-2 p-2 m-2">
        <Col sm={8}>
          <StockFeed symbol={symbol} />
        </Col>
        <Col sm={4}>
          <StockChart symbol={symbol} />
        </Col>
      </Row>
      <Row xs={1} md={2} className="g-2 p-2 m-2">
        <Col sm={8}>
          <StockTable symbol={symbol} />
        </Col>
        <Col sm={4}>
          <StockSentiment symbol={symbol} />
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <StockTwitter symbol={symbol} />
        </Col>
      </Row>
    </Container>

    // <div>
    //   <span>Socket Open stats : {connectionStatus}</span>
    //   <br />
    //   Current
    //   <Quote />
    //   <br />

    //   {/* <StockTable symbol={symbol}/> */}
    //   <StockChart symbol={symbol}/>

    //   History
    //   <QuoteHistory />

    // </div>
  );
}
