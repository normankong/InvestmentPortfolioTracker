const moment = require("moment");

// Get the DynamoDB table name from environment variables
const TABLE_NAME = process.env.TABLE_NAME;

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

  if (/^[a-zA-Z]{1,4}$/.test(symbol) === false) {
    const response = {
      statusCode: 403,
      body: "Invalid Stock Symbol",
    };
    return response;
  }

  // Get the item from the table
  var getRequest = {
    TableName: TABLE_NAME,
    Key: { symbol },
  };
  const data = await docClient.get(getRequest).promise();
  let item = data.Item;

  if (item === undefined) {

    await createRecord(symbol);
    item = { message: "Start polling" };

  } else {

    let expiryTime = moment(item.createTimestamp).add(1, "minutes");
    console.log(`Expiry Time ${expiryTime}`);

    if (moment().isAfter(expiryTime)) {
      
      await deleteRecord(symbol);

      await createRecord(symbol);

      item = { message: "Refreshing Record" };
    }
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

const createRecord = async (symbol) => {
  console.log(`Creating : ${symbol}`);

  let now = moment().format("YYYY-MM-DD HH:mm:ss");
  var putRequest = {
    TableName: TABLE_NAME,
    Item: { symbol, createTimestamp: now },
  };
  await docClient.put(putRequest).promise();
};

const deleteRecord = async (symbol) => {
  console.log(`Deleting : ${symbol}`);

  await docClient
    .delete({
      TableName: TABLE_NAME,
      Key: { symbol },
    })
    .promise();
};
