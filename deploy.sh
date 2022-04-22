# Twitter Information
# API KEY = TDykvHaMljw8vjKnGDWCceu8A
# API_SECRET = l1A1dJxAfXLssL9lWMEIeRyZISHoxKHqPoGv2oqFm53FP6cTvW
# ACCESS_TOKEN=1509230424479789057-Hkv7M0ZETwzCHpZw3DrXUxDwdHNZu9
# ACCESS_TOKEN_SECRET=WnQQBlAlHY2jKfWw4cjXxIDuCjLehYspDcZDi4OJYeM75
# BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAACLKawEAAAAAgNTNkU1FAfKwo3XZDnWYaxifoV0%3DnFeNZy8WgDZ4EXNrDnZEtvVWD21TvaVmkOpO6Q7QDfhXrp3wsC

# ALPHAVANTAGE1=66bdb06287mshec18472be0bca9cp1c1e5bjsn720d68babad7
# ALPHAVANTAGE2=V4URIIKUHN1ZM2LG

# Get Identity
aws sts get-caller-identity

# Create Stack S3 for stack log
# aws s3 mb s3://sam-sentiment-stack

# # Infra 
# cd sam-sentiment-infra
# sam build
# sam deploy --stack-name sam-sentiment-infra
# cd ../
# export TOPIC=`aws sns  list-topics | jq '.Topics[0].TopicArn'`
# export TABLE_NAME=`aws dynamodb list-tables | jq '.TableNames[0]' -r`
# export QUEUE_URL=`aws sqs list-queues | jq '.QueueUrls[0]' -r`
# export QUEUE_ARN=`aws sqs get-queue-attributes --queue-url $QUEUE_URL --attribute-names QueueArn | jq '.Attributes.QueueArn'`
# echo QUEUE_ARN      : $QUEUE_ARN
# echo TABLE_NAME     : $TABLE_NAME
# echo TOPIC          : $TOPIC
# echo QUEUE_ARN      : $QUEUE_ARN

# # State Machine
# cd sam-sentiment-machine
# export TOKEN=AAAAAAAAAAAAAAAAAAAAACLKawEAAAAAgNTNkU1FAfKwo3XZDnWYaxifoV0%3DnFeNZy8WgDZ4EXNrDnZEtvVWD21TvaVmkOpO6Q7QDfhXrp3wsC
# export ALPHAVANTAGE_API_KEY=66bdb06287mshec18472be0bca9cp1c1e5bjsn720d68babad7
# sam build
# sam deploy --stack-name sam-sentiment-machine --parameter-overrides TwitterToken="$TOKEN" TableName=$TABLE_NAME QueueARN=$QUEUE_ARN AlphaVantageAPIKey=$ALPHAVANTAGE_API_KEY
# cd ../

# # # Request
# cd sam-sentiment-request
# sam build
# sam deploy --stack-name sam-sentiment-request --parameter-overrides TableName=$TABLE_NAME
# cd ../

# # # Website
# cd sam-sentiment-website
# sam build
# sam deploy --stack-name sam-sentiment-website
# cd ../

# Web Socket
# cd sam-sentiment-socket
# sam build
# sam deploy --stack-name sam-sentiment-socket  
# cd ../

# # Fargate Deployment
# cd sam-sentiment-fargate
# sam build
# sam deploy --stack-name sam-sentiment-fargate
# cd ../

# For Client Deployment
# cd sam-sentiment-website/client
# npm run build
# aws s3 sync build s3://sam-sentiment-website/
# cd ../../

# #Invalidate Cloudfront
# DISTRIBUTION_ID=`aws cloudfront list-distributions | jq '.DistributionList.Items[0].Id' -r`
# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"


# For Trigger CQRS API
#sam build
#sam local invoke -e events/event.json --env-vars env.json