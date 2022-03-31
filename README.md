python3 -m venv envsource env/bin/activate


source env/bin/activate

API KEY = TDykvHaMljw8vjKnGDWCceu8A
API_SECRET = l1A1dJxAfXLssL9lWMEIeRyZISHoxKHqPoGv2oqFm53FP6cTvW
ACCESS_TOKEN=1509230424479789057-Hkv7M0ZETwzCHpZw3DrXUxDwdHNZu9
ACCESS_TOKEN_SECRET=WnQQBlAlHY2jKfWw4cjXxIDuCjLehYspDcZDi4OJYeM75
BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAACLKawEAAAAAgNTNkU1FAfKwo3XZDnWYaxifoV0%3DnFeNZy8WgDZ4EXNrDnZEtvVWD21TvaVmkOpO6Q7QDfhXrp3wsC

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