
[Link](https://medium.com/@arliber/aws-fargate-from-start-to-finish-for-a-nodejs-app-9a0e5fbf6361)

# Sam Build to create basic 
sam build
sam deploy --stack-name sam-fargate

# Prepare Docker
docker build -t my_ecr .

# Test Docker
docker run -it -p 80:80 my_ecr

# Create ECR via Console
ACCOUNT_ID=`aws sts get-caller-identity  | jq .Account -r`
ECR_URL=$ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
ECR_IMAGE_URL=$ECR_URL/sam-sentiment-fargate-ecr:latest
echo $ECR_IMAGE_URL

# Push the Docker image  (Copy from the AWS ECR Console)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL
docker build -t sam-sentiment-fargate .
docker tag sam-sentiment-fargate:latest $ECR_IMAGE_URL
docker push $ECR_IMAGE_URL


# Getting Information
## Subnet
aws ec2 describe-subnets | jq '.Subnets[] |  .SubnetId' -r
## Security Group
SECURITY_GROUP=`aws ec2 describe-security-groups | jq '.SecurityGroups[0].GroupId' -r`
## Domain Name
aws cloudfront list-distributions | jq '.DistributionList.Items[0].DomainName' -r
aws cloudfront list-distributions | jq '.DistributionList.Items[0].Id' -r
## Export Fargate Task Information
aws ecs describe-task-definition --task-definition MyargateTask:1
