#!/usr/bin/env node
import "source-map-support/register"
import cdk = require("aws-cdk-lib")
import { CDKExampleLambdaApiStack } from "../lib/lambda-bedrock-stack"
import { AmplifyInfraStack } from "../lib/amplify-stack"

export const lambdaFunctionName = "ImageDescriptionFunction"

const app = new cdk.App()
new CDKExampleLambdaApiStack(app, "CDKImageDescriptionStack", {
    functionName: lambdaFunctionName,
})

new AmplifyInfraStack(app, "CDKFrontEndStack", {})
