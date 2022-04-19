"use strict";

const WebSocket = require("ws");

class FinHubHelper {

  socket = null;

  // Constructor
  constructor(socketHelper) {
    this.socket = new WebSocket("wss://ws.finnhub.io?token=c9a7gr2ad3icvte9htig");

    // Connection opened -> Subscribe
    this.socket.addEventListener("open", function (event) {
      console.log(`Connected to FinnHub`);
    });

    // Listen for messages
    this.socket.addEventListener("message", function (event) {
      let node = JSON.parse(event.data);
      console.log(`Receiving Information ...` );
      socketHelper.broadcasting(node);
    });

    // Add Subscription Handler
    socketHelper.addSubscriptionHandler(this.subscribeSymbol);
  }

  // Subscribe Symbol
  subscribeSymbol = (symbol) => {
    console.log(`Subscribing ${symbol}`);
    // socket.send(JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" }));
    this.socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
  };

  // Unsubscribe Symbol
  unsubscribeSymbol = function (symbol) {
    console.log(`Unsubscribing ${symbol}`);
    this.socket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
  };
}
module.exports = FinHubHelper;
