const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const TABLE_NAME = process.env.TABLE_NAME

exports.handler = async (event) => {
    console.log('Received event ', event);

    let response = null;
    const { eventType, connectionId } = event.requestContext;
    if (eventType === 'CONNECT') {
        response = generateLambdaProxyResponse(200, `Connected event ${eventType} for connection ${connectionId}`);
    }
    else if (eventType === 'DISCONNECT') {
        await cleanUpSubscription(connectionId);
        response = generateLambdaProxyResponse(200, `Disconnect event ${eventType} for connection ${connectionId}`);
    }
    else {
        response = generateLambdaProxyResponse(200, `Received event ${eventType} for connection ${connectionId}`);
    }
    
    console.log(response);

    return response;
}

function generateLambdaProxyResponse(httpCode, jsonBody) {
    return {
        body: jsonBody,
        statusCode: httpCode,
    };
}


async function cleanUpSubscription(connectionId) {
    console.log(`Cleaning up : ${connectionId}`);
    try {
      let result = await ddb
        .scan({
          TableName: TABLE_NAME,
          ProjectionExpression: "symbol, connectionIds",
        })
        .promise();
  
        for (let item of result.Items){
            console.log(`Checking : ${item.symbol} with ${item.connectionIds}`);
            if (item.connectionIds.includes(connectionId)){
                let index = item.connectionIds.indexOf(connectionId);
                item.connectionIds.splice(index, 1);

                if (item.connectionIds.length === 0){
                    console.log(`Deleting : ${item.symbol}`);
                    await ddb.delete({
                        TableName: TABLE_NAME,
                        Key: {
                            symbol: item.symbol,
                        },
                    }).promise();
                }
                else{
                    console.log(`Cleaning up : ${item.symbol} with ${item.connectionIds}`);
                    await ddb
                    .update({
                        TableName: TABLE_NAME,
                        Key: {
                            symbol: item.symbol,
                        },
                        UpdateExpression: "set connectionIds = :connectionIds",
                        ExpressionAttributeValues: {
                            ":connectionIds": item.connectionIds,
                        },
                    })
                    .promise();
                }
            }
        }

    } catch (e) {
      return { statusCode: 500, body: e.stack };
    }
  }
  