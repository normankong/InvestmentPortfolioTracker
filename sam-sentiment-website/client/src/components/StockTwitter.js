/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import SimpleTable from "../components/SimpleTable";
import apiHelper from "../api/apiHelper";
import Spinner from "../components/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default function StockTwitter({ symbol }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data");
      let json = await apiHelper.getQuote(symbol);
      if (json.twitter === null) {
        setTimeout(fetchData, 1000);
        return;
      }

      let twitter = json.twitter;
      let list = [];

      let length = Math.min(twitter.length, 10);
      for (let i = 0; i < length; i++) {
        list.push({ id : twitter[i].id, text: twitter[i].text });
      }
      setList(list);
    };

    fetchData();
  }, [symbol]);

  if (list === null) return <Spinner />;

  let LIMIT = 250;
  return (
    <>
    <hr/>
    <Row xs={1} md={2} className="g-0 p-1 m-1">
      Tweets
    </Row>
    <Row xs={1} md={2} className="g-1 p-1 m-1">
      {list.map((item) => (
        <Col key={item.id}>
          <Card>
            <Card.Body className="bg-light" style={{minHeight:"100px"}}>
              <Card.Text>{(item.text).length > LIMIT ? item.text.substr(0, LIMIT-3) + "..." : item.text}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </>
  );
}