const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const TABLE_NAME = process.env.TABLE_NAME

exports.handler = async (event) => {
  console.log("Received event ", event);

  const { eventType, connectionId } = event.requestContext;
  const symbol = JSON.parse(event.body).symbol;

  let result = await getExistingSubscription(symbol);
  if (result === undefined) {
    await createRecord(symbol, connectionId);
  } else {
    let isExist = result.connectionIds.includes(connectionId);
    if (isExist){
        console.log(`Connection ${connectionId} already exist for this symbol ${symbol}`);
    }
    else{
        await updateRecord(symbol);
    }
  }

  let response = generateLambdaProxyResponse(
    200,
    `Received event ${eventType} for connection ${connectionId}`
  );

  console.log(response);

  return response;
};

function generateLambdaProxyResponse(httpCode, jsonBody) {
  return {
    body: jsonBody,
    statusCode: httpCode,
  };
}

async function getExistingSubscription(symbol) {
  let params = {
    TableName: TABLE_NAME,
    Key: {
      symbol: symbol,
    },
  };
  let result = await ddb.get(params).promise();
  return result.Item;
}

const createRecord = async (symbol, connectionId) => {
  console.log(`Creating : ${symbol}`);

  var putRequest = {
    TableName: TABLE_NAME,
    Item: { symbol, connectionIds: [connectionId] },
  };
  await ddb.put(putRequest).promise();
};


const updateRecord = async (result, connectionId) => {
    console.log(`Subscription for ${symbol}`);
    result.connectionIds.push(connectionId);
    await ddb.put({
        TableName: TABLE_NAME,
        Item: result
    }).promise();
};