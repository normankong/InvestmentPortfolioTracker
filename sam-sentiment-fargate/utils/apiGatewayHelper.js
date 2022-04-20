"use strict";

require("dotenv").config();

const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const TABLE_NAME = process.env.TABLE_NAME;
const DOMAIN_NAME = process.env.DOMAIN_NAME;
const STAGE = process.env.STAGE;

class ApiGatewayHelper {
  // API Management API Instance
  apigwManagementApi = null;

  /**
   * Constructor
   */
  constructor() {
    console.log(`Initial ApiGatewayHelper`);

    this.apigwManagementApi = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: DOMAIN_NAME + "/" + STAGE,
    });
  }

  /**
   * Broadcasting message to API Gateway
   */
  broadcasting = async (message) => {
    console.log(`Sending in APIGateayway : ${message}`);

    let symbol = this._extractSymbol(message);
    if (symbol === null) {
      console.log(`Receiving unexpected message ${message}`);
      return;
    }

    let connectionIds = await this._getSubscription(symbol);
    console.log(`Number of active connection for this symbol : ${connectionIds.length}`);
    for (let connectionId of connectionIds) {
      console.log(`Sending message to ${connectionId} with message ${message}`);
      message = JSON.stringify(message);
      try {
        await this.apigwManagementApi
        .postToConnection({ ConnectionId: connectionId, Data: message })
        .promise();
      }
      catch (ex){
        console.log(`Connection close, please cleanup  : ${connectionId}`);
      }

    }
  };

  /**
   * Get Subscription based on Symbol
   */
  _getSubscription = async (symbol) => {
    let params = {
      TableName: TABLE_NAME,
      Key: {
        symbol: symbol,
      },
    };
    let result = await ddb.get(params).promise();

    if (result.Item === undefined) return [];
    let connectionsIds = result.Item.connectionIds;
    return connectionsIds;
  };

  /**
   * Extract the Symbol from the message
   */
  _extractSymbol = (message) => {
    try {
      return message.data[0].s;
    } catch (ex) {
      return null;
    }
  };
}
module.exports = ApiGatewayHelper;
