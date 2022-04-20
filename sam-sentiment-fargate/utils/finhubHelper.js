"use strict";

const WebSocket = require("ws");

class FinHubHelper {
  symbols = null;
  socket = null;

  // Constructor
  constructor(helper) {
    this.socket = new WebSocket(
      "wss://ws.finnhub.io?token=c9a7gr2ad3icvte9htig"
    );

    // Connection opened -> Subscribe
    this.socket.addEventListener("open", function (event) {
      console.log(`Connected to FinnHub`);
    });

    // Listen for messages
    this.socket.addEventListener("message", function (event) {
      let node = JSON.parse(event.data);
      console.log(`Receiving Information ...`);
      helper.broadcasting(node);
    });

    // Add Subscription Handler
    if (helper.addSubscriptionHandler) {
      helper.addSubscriptionHandler(this.subscribeSymbol);
    }

    this.symbols = [];
  }

  // Subscribe Symbol
  subscribeSymbol = (symbol) => {
    console.log(`Subscribing ${symbol}`);
    if (this.symbols.indexOf(symbol) !== -1) {
      return console.log(`It have already before`);
    } else {
      console.log(`Subscribing ${symbol} to finnhub`);
      this.symbols.push(symbol);
      this.socket.send(JSON.stringify({ type: "subscribe", symbol: symbol }));
    }
  };

  // Unsubscribe Symbol
  unsubscribeSymbol = function (symbol) {
    console.log(`Unsubscribing ${symbol}`);

    if (this.symbols.indexOf(symbol) !== -1) {
      return console.log(`It never subscribed before`);
    }
    // Splice the symbol from the list.
    this.socket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
    this.symbols.splice(this.symbols.indexOf(symbol), 1);
  };

  reSubscribeSymbol = function (symbols) {
    console.log(`Resubscribing ${symbols}`);

    let newSymbols = symbols.filter((symbol) => this.symbols.indexOf(symbol) === -1);
    let oldSymbols = this.symbols.filter((symbol) => symbols.indexOf(symbol) === -1);

    for (let symbol of newSymbols) {
      this.subscribeSymbol(symbol);
    }

    for (let symbol of oldSymbols) {
      this.unsubscribeSymbol(symbol);
    }
  }
}
module.exports = FinHubHelper;
