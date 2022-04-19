"use strict";

// require("dotenv").config();

// let connectionId = "Qw2YCeELIAMCE4g=";
// let domainName=  '0kor261imf.execute-api.us-east-1.amazonaws.com';
// let stage = 'Prod';

class ApiGatewayHelper {

    constructor(domainName, stage) {
        this.apigwManagementApi = new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: domainName + '/' + stage
        })
    }

    broadcasting = async (connectionId, message) =>{
        await this.apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: message }).promise();
    }
    
}
module.exports = ApiGatewayHelper;
