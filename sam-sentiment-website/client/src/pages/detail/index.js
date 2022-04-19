/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import SimpleTable from "../../components/SimpleTable";

export default function Detail() {
  const location = useLocation();

  const [quote, setQuote] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    process.env.REACT_APP_SOCKET_URL
  );

  useEffect(() => {
    console.log(`Receiving Message ${JSON.stringify(lastMessage, null, 2)}`);
    if (lastMessage !== null) {
      setQuote((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  useEffect(() => {
    let symbol = location.state?.symbol;
    // symbol = "BINANCE:BTCUSDT"
    console.log(`Symbol ${symbol}`);
    sendMessage(`${symbol}`);
  }, [location]);

  const isJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const Quote = () => {
    let myQuote = quote[quote.length - 1];
    try {
      if (!isJson(myQuote.data)) {
        return <div>Data is not ready</div>;
      }

      let tmp = JSON.parse(myQuote.data);
      let list = [];
      list.push({ key: tmp.data[0]?.s, value: tmp.data[0]?.p });

      return <SimpleTable list={list} />;
    } catch (exception) {
      console.log(exception);
      return <></>;
    }
  };

  const QuoteHistory = () => {
    try {
      let list = quote
        .filter((x) => isJson(x.data))
        .map((message) => {
          // console.log(message.data);
          let tmp = JSON.parse(message.data);
          return { key: tmp.data[0]?.s, value: tmp.data[0]?.p };
        });
      return <SimpleTable list={list} />;
    } catch (exception) {
      console.log(exception);
      return <></>;
    }
  };

  return (
    <div>
      <span>Socket Open stats : {connectionStatus}</span>
      <br />
      Current
      <Quote />
      <br />
      History
      <QuoteHistory />
    </div>
  );
}
