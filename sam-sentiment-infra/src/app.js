var AWS = require("aws-sdk");
var sns = new AWS.SNS();

const TOPIC = process.env.TOPIC;

/**
 * A Lambda function that write event into SNS topic.
 */
exports.handler = async (event, context, callback) => {

    event.Records.forEach((record) => {
        console.log('Stream record: ', JSON.stringify(record, null, 2));

        if (record.eventName == 'INSERT') {
            var symbol = record.dynamodb.NewImage.symbol.S;

            var params = {
                Message: symbol,
                TopicArn: TOPIC
            };
            sns.publish(params, function(err, data) {
                if (err) {
                    console.error("Unable to send message. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Results from sending message: ", JSON.stringify(data, null, 2));
                }
            });
        }
    });
    callback(null, `Successfully processed ${event.Records.length} records.`);
}


