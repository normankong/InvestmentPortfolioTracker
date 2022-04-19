exports.handler = async (event) => {
    console.log('Received event ', event);

    let response = null;
    const { eventType, connectionId } = event.requestContext;
    if (eventType === 'CONNECT') {
        response = generateLambdaProxyResponse(200, `Connected event ${eventType} for connection ${connectionId}`);
    }
    else if (eventType === 'DISCONNECT') {
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