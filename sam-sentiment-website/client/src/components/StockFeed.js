/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Spinner from "../components/Spinner";
import SimpleTable from "../components/SimpleTable";
import { Table, Row, Container, Col } from "react-bootstrap";

export default function StockFeed({ symbol }) {
  const [quote, setQuote] = useState([]);
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const previousPrice = usePrevious(price);

  // const lastMessage = "";
  // const sendMessage = () => {};
  // const readyState = ReadyState.OPEN;
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    process.env.REACT_APP_SOCKET_URL
  );

  // Subscription
  useEffect(() => {
    let request = { action: "sendmessage", symbol };
    sendMessage(`${JSON.stringify(request)}`);
  }, [symbol]);

  // On Message Received
  useEffect(() => {
    console.log(`Receiving Message `);
    if (lastMessage !== null) {
      setQuote((prev) => prev.concat(lastMessage));
    }

    let price = extractPrice(lastMessage);
    if (price < 0) return setPrice("N/A");

    setPrice(price);
    if (previousPrice === "N/A") return setChange(0);

    let change = parseFloat(price - previousPrice).toFixed(4);
    setChange(change);
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  if (quote.length === 0) return <>Loading</>;

  return (
    <>
      <span>Socket Open stats : {connectionStatus}</span>
      <div
        className="border d-flex align-items-center justify-content-center"
        style={{ minHeight: "300px" }}
      >
        <h1>{price}</h1>
        <h6 className={change >= 0 ? "text-success" : "text-danger"}>
          {(change >= 0 ? "+" : "") + change}
        </h6>
      </div>
    </>
  );
}

const isJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const extractPrice = (message) => {
  if (message === null) {
    return -999;
  }

  try {
    let tmp = JSON.parse(message.data);
    if (tmp.data != null) {
      return tmp.data[0]?.p;
    }
    return -1;
  } catch (exception) {
    return -2;
  }
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
