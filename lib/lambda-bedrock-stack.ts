import { Cors, LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway"
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode, Code } from "aws-cdk-lib/aws-lambda"
import { Duration, SecretValue, Stack, StackProps } from "aws-cdk-lib"
import s3 = require("aws-cdk-lib/aws-s3")
import { Construct } from "constructs"

interface LambdaApiStackProps extends StackProps {
    functionName: string
}

export class CDKExampleLambdaApiStack extends Stack {
    private restApi: RestApi
    private lambdaFunction: Function
    private bucket: s3.Bucket

    constructor(scope: Construct, id: string, props: LambdaApiStackProps) {
        super(scope, id, props)

        this.bucket = new s3.Bucket(this, "PictureStore")

        this.restApi = new RestApi(this, this.stackName + "RestApi", {
            deployOptions: {
                stageName: "beta",
                metricsEnabled: true,
                loggingLevel: MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            binaryMediaTypes: ["multipart/form-data"],
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS, // Replace with your allowed origins
                allowMethods: Cors.ALL_METHODS, // Allow all HTTP methods
                allowHeaders: ["*"], // Add any required headers
            },
        })

        const lambdaPolicy = new PolicyStatement()
        // Permission to call bedrock models
        lambdaPolicy.addActions("bedrock:InvokeModel")
        lambdaPolicy.addResources(
            `${this.bucket.bucketArn}/*`,
            `arn:aws:bedrock:*::foundation-model/*`,
        )

        //Permissions to save or get file in S3
        lambdaPolicy.addActions("s3:ListBucket")
        lambdaPolicy.addActions("s3:getBucketLocation")
        lambdaPolicy.addActions("s3:GetObject")
        lambdaPolicy.addActions("s3:PutObject")
        lambdaPolicy.addResources(this.bucket.bucketArn)

        this.lambdaFunction = new Function(this, props.functionName, {
            functionName: props.functionName,
            handler: "handler.handler",
            runtime: Runtime.NODEJS_18_X,
            code: new AssetCode(`./src`),
            memorySize: 512,
            // role: lambdaRole,
            timeout: Duration.seconds(300),
            environment: {
                BUCKET: this.bucket.bucketName,
                MODEL_ID: "anthropic.claude-3-sonnet-20240229-v1:0",
            },
        })

        this.lambdaFunction.addToRolePolicy(lambdaPolicy)
        this.restApi.root.addMethod("POST", new LambdaIntegration(this.lambdaFunction, {}))
    }
}
