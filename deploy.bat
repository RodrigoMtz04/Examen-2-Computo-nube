@echo off
echo Building Docker image...
docker build -t fitness-band-recommendation .

echo Tagging image for ECR...
docker tag fitness-band-recommendation:latest %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/fitness-band-recommendation:latest

echo Pushing to ECR...
docker push %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/fitness-band-recommendation:latest

echo Updating ECS service...
aws ecs update-service --cluster %ECS_CLUSTER% --service fitness-band-recommendation --force-new-deployment --region %AWS_REGION%

echo Deployment complete!
