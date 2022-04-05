const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

const fetch = require("node-fetch");
const TABLE_NAME = process.env.TABLE_NAME;
const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

/**
 * A Lambda function that trigger AlphaVantage and update Quote
 */

exports.handler = async (event) => {
  console.log(event);

  let symbol = event.Message;
  let url = `https://alpha-vantage.p.rapidapi.com/query?function=TIME_SERIES_DAILY&symbol=${symbol}&datatype=json`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
      "X-RapidAPI-Key": ALPHAVANTAGE_API_KEY,
    },
  });
  const quote = await response.json();
  console.log(quote);

  var params = {
    TableName: TABLE_NAME,
    Key: { symbol : symbol },
    UpdateExpression: "set daily = :r",
    ExpressionAttributeValues: {
      ":r": quote
    },
    ReturnValues: "UPDATED_NEW",
  };

  console.log("Updating the item...");

  let result = await docClient.update(params).promise();
  console.log(result)

  // await docClient.update(params, function (err, data) {
  //   if (err) {
  //     console.error(
  //       "Unable to update item. Error JSON:",
  //       JSON.stringify(err, null, 2)
  //     );
  //   } else {
  //     console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
  //   }
  // });

  return quote;
};
