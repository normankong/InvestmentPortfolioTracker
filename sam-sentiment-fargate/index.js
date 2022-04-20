"use strict";

var express = require('express');
var expressWs = require('express-ws');

var expressWs = expressWs(express());
var app = expressWs.app;

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const APIGatewayHelper = require("./utils/apiGatewayHelper");
// const SocketHelper = require("./utils/socketHelper");
const FinHubHelper = require("./utils/finhubHelper");
const SubscriptionHelper =require("./utils/subscriptionHelper");

let buffer = "";
let apiGatewayHelper = null;
let finHubHelper = null;
let subscriptionHelper = null;

const port = process.env.PORT || 80;

app.get("/", (req, res) => {
  res.send(`<pre>${JSON.stringify(buffer, null, 2)}</pre>`);
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.get("/:symbol", (req, res) => {
  let symbol= req.params.symbol
  finHubHelper.subscribeSymbol(symbol)
  res.send(symbol)
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
  console.log(`http://localhost:${port}`);

  let ws = expressWs.getWss();
  // socketHelper = new SocketHelper(ws);
  apiGatewayHelper = new APIGatewayHelper();
  finHubHelper = new FinHubHelper(apiGatewayHelper);
  subscriptionHelper = new SubscriptionHelper(finHubHelper);
  
});

