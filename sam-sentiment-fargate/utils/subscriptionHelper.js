"use strict";

require("dotenv").config();
const AWS = require("aws-sdk");

// AWS.config.update({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var QUEUE_URL = process.env.QUEUE_URL;

const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});
const TABLE_NAME = process.env.TABLE_NAME;

class SubscriptionHelper {
  finhubHelper = null;

  /**
   * Constructor
   */
  constructor(finhubHelper) {
    console.log(`Initial SubscriptionHelper`);
    this.finhubHelper = finhubHelper;

    // Start the SNS Listener
    setTimeout(this._listen, 1000);

    // Initialize Subscription
    setTimeout(this._initializeSubscription, 3000);
  }

  _listen = async () => {
    let _self = this;

    let params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ["All"],
      QueueUrl: QUEUE_URL,
      WaitTimeSeconds: 20,
    };

    sqs.receiveMessage(params, async function (err, data) {
      // console.log(data)
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages) {
        // Acknowledge the message
        _self._acknowledgeMessage(data);

        // Extract Symbols from DB
        let symbols = await _self._getSubscription();
        console.log(`Pending to subscribe symbols : ${symbols.length}`);

        // Subscribe Symbols
        _self.finhubHelper.reSubscribeSymbol(symbols);
      }

      setTimeout(_self._listen, 1000);
    });
  };

  /**
   * Get Subscription
   */
  _getSubscription = async () => {
    let result = await ddb
      .scan({
        TableName: TABLE_NAME,
        ProjectionExpression: "symbol",
      })
      .promise();

    if (result.Items === undefined) return [];
    return result.Items.map((x) => x.symbol);
  };

  /**
   * Acknowledge the message
   */
  _acknowledgeMessage = async (data) => {
    for (let msg of data.Messages) {
      console.log(`Received message ${msg.MessageId} - ${msg.Body}`);
      var deleteParams = {
        QueueUrl: QUEUE_URL,
        ReceiptHandle: msg.ReceiptHandle,
      };
      await sqs.deleteMessage(deleteParams).promise();
      // console.log(`Deleted message ${msg.MessageId}`);
    }
  };

  /**
   * Initialize Subscription
   */
  _initializeSubscription = async () => {
    // Extract Symbols from DB
    let symbols = await this._getSubscription();
    console.log(`Loading subscription list from DB : ${symbols.length}`);

    // Subscribe Symbols
    this.finhubHelper.reSubscribeSymbol(symbols);
  };
}

module.exports = SubscriptionHelper;
