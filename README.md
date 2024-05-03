
# Description
This project demonstrate how to use a lambda function to extract information from a picture using generative AI.
To achieve that, we use Claude v3 Sonnet inside Bedrock to provide vision capability.

# What's inside?
This is code sample that uses CDK to:
* Create an APi Gateway to handle request
* Create a policy for the Lambda to call bedrock API and S3
* Create a nodejs Lambda function that can be invoked using API Gateway
* Create an S3 bucket to save the picture

# How do I start using it?
1. Ensure you've followed the [guide to Getting Started to AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html), and you have CDK installed, and the AWS SDK installed and credentials configured. 
2. In the root folder, [Bootstrap your AWS environment](https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html#serverless_example_deploy_and_test) with `cdk bootstrap`
3. Build the stack with `npm run build`
4. Deploy the  stack with `cdk deploy --all`
