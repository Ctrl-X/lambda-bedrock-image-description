#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("aws-cdk-lib")
import { CDKExampleLambdaApiStack } from "../lib/lambda-bedrock-stack"

export const lambdaBedrockStackName = "CDKImageDescriptionStack"
export const lambdaFunctionName = "ImageDescriptionFunction"

const app = new cdk.App()
new CDKExampleLambdaApiStack(app, lambdaBedrockStackName, {
    functionName: lambdaFunctionName,
})
