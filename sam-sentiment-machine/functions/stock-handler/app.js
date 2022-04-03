var { StepFunctions } = require('aws-sdk')

const MACHINE_ARN = process.env.MACHINE_ARN;

/**
 * A Lambda function that trigger step function
 */

exports.handler = async (event) => {

    console.log(event);

    const startExecution = createExecutor({clients});

    let result = await startExecution(event);

    return result;
  }

  const clients = {
    stepFunctions: new StepFunctions()
  }

  const createExecutor = ({ clients }) => async (event) => {
  
    let jsonBody = event.Records[0].body;
    let symbol = JSON.parse(jsonBody).Message;

    console.log(`Symbol : ${symbol}`);

    var params = {
      stateMachineArn: MACHINE_ARN,
      input: jsonBody
    }
  
    const result = await clients.stepFunctions.startExecution(params).promise();
  
    return result;
  };