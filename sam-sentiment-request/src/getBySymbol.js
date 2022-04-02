// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getMethod only accept GET method, you tried: ${event.httpMethod}`
    );
  }

  console.info("received:", event);

  // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
  const symbol = event.pathParameters.symbol;
  console.info(`symbol: ${symbol}`);

  // Get the item from the table
  var getRequest = {
    TableName: tableName,
    Key: { symbol },
  };
  const data = await docClient.get(getRequest).promise();
  let item = data.Item;

  if (item === undefined) {
    var putRequest = {
      TableName: tableName,
      Item: { symbol : symbol },
    };
    await docClient.put(putRequest).promise();
    item = { responseCode : "404", message: "No data found, start polling" };
  }
  else if (item.sentiment === undefined){
    item = { responseCode : "405", message: "Polling in progress" };
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(item),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
