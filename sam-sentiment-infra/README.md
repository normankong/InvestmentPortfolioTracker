# Server Side implementation on Twitter Fetcher

python3 -m venv envsource env/bin/activate

source env/bin/activate

sam build       

sam local invoke

sam local start-api 

sam deploy --guided

sam build ; sam local invoke -e events/event.json --env-vars env.json

sam local generate-event sns notification --message=TSLA

SentimentAnalysis
sam-sentiment-analysis

https://medium.com/tuimm/using-aws-sam-to-build-and-deploy-an-application-with-sns-sqs-and-lambda-services-91e909b0f1d2

sam deploy 
echo '{"hello":"ciao"}' | sam local invoke -e -


https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html
{
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "sns.amazonaws.com"
      },
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:us-east-1:688504933740:sam-sentiment-analysis",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:sns:us-east-1:688504933740:sam-sentiment-analysis"
        }
      }
    }
  ]
}


https://dynobase.dev/dynamodb-aws-sam/

SNS to SQS Policy
https://serverlessland.com/patterns/sns-sqs