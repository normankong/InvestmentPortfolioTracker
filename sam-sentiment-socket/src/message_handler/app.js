const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});
var sns = new AWS.SNS({apiVersion: '2010-03-31'})

const TABLE_NAME = process.env.TABLE_NAME;
var TOPIC = process.env.TOPIC;

exports.handler = async (event) => {
  console.log("Received event ", event);

  const { eventType, connectionId } = event.requestContext;
  const symbol = JSON.parse(event.body).symbol;

  let result = await getExistingSubscription(symbol);
  let isRefreshSubcription = false;
  if (result === undefined) {
    await createRecord(symbol, connectionId);
    isRefreshSubcription = true;
  } else {
    let isExist = result.connectionIds.includes(connectionId);
    if (isExist) {
      console.log(`Connection ${connectionId} have subscribed ${symbol}`);
    } else {
      await updateRecord(result, symbol, connectionId);
      isRefreshSubcription = true;
    }
  }

  // Refresh Subscription is required.
  if (isRefreshSubcription){
    var params = {
      Message: JSON.stringify({ action: "REFRESH", symbol, connectionId }),
      TopicArn: TOPIC,
    };

    try{
      let snsResponse = await sns.publish(params).promise();
      console.log(snsResponse);
    }
    catch (ex){
      console.log(ex);
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

const updateRecord = async (result, symbol, connectionId) => {
  console.log(`Subscription for ${symbol}`);
  result.connectionIds.push(connectionId);
  await ddb
    .put({
      TableName: TABLE_NAME,
      Item: result,
    })
    .promise();
};
