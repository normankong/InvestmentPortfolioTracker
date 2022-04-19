
[Link](https://medium.com/@arliber/aws-fargate-from-start-to-finish-for-a-nodejs-app-9a0e5fbf6361)

# Prepare Docker
docker build -t my_ecr .

# Test Docker
docker run -it -p 80:80 -p  my_ecr

aws ecr create-repository --repository-name my_ecr 
aws ecr describe-repositories --repository-names my_ecr | jq -r '. | .repositories[0].repositoryUri' 

<!-- aws ecr create-cluster  --cluster-name MyCluster -->

aws ecs create-service \
    --cluster sam-fargate-ECSFargateCluster-0Dm6zjwq05P9 \
    --service-name MyService2 \
    --task-definition sam-fargate-ECSServiceTaskDefinition-4GQwUVLiNHKW:1 \
    --desired-count 1 \
    --launch-type FARGATE \
    --platform-version LATEST \
    --network-configuration "awsvpcConfiguration={subnets=[subnet-020a0b96a6ae3b86a,subnet-0483b4e3acb9d9b67,subnet-02c9cdc42dc3743f7,subnet-070baf3fbb3de6fd1,subnet-0e2c3d0b84c3b666c,subnet-0e476e5dc1b26fdd5],securityGroups=[sg-0d68a1c6c8a6bea28],assignPublicIp=ENABLED}" 

aws ecs register-task-definition --cli-input-json file://skeleton.json


# Create ECR via Console
aws ecr create-repository --repository-name my_ecr 
ACCOUNT_ID=`aws sts get-caller-identity  | jq .Account -r`
ECR_IMAGE_URL=$ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/my_ecr:latest

# Push the Docker image  (Copy from the AWS ECR Console)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker build -t my_ecr .
docker tag my_ecr:latest $ECR_IMAGE_URL
docker push $ECR_IMAGE_URL

aws s3 mb s3://sam-fargate-stack 
sam build
sam deploy --stack-name sam-fargate --parameter-overrides ECRImageURL=$ECR_IMAGE_URL
--guided 

aws ec2 describe-subnets | jq '.Subnets[] |  .SubnetId' -r
SECURITY_GROUP=`aws ec2 describe-security-groups | jq '.SecurityGroups[0].GroupId' -r`


#Domain Name
aws cloudfront list-distributions | jq '.DistributionList.Items[0].DomainName' -r
aws cloudfront list-distributions | jq '.DistributionList.Items[0].Id' -r
