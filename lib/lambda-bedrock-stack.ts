import { LambdaIntegration, MethodLoggingLevel, RestApi } from "aws-cdk-lib/aws-apigateway"
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam"
import { Function, Runtime, AssetCode, Code } from "aws-cdk-lib/aws-lambda"
import { Duration, SecretValue, Stack, StackProps } from "aws-cdk-lib"
import s3 = require("aws-cdk-lib/aws-s3")
import { Construct } from "constructs"
import { BuildSpec } from "aws-cdk-lib/aws-codebuild"

import { App, GitHubSourceCodeProvider } from "@aws-cdk/aws-amplify-alpha"

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
                dataTraceEnabled: true
            },
            binaryMediaTypes: ["multipart/form-data"]
        })

        const lambdaPolicy = new PolicyStatement()
        // Permission to call bedrock models
        lambdaPolicy.addActions("bedrock:InvokeModel")

        //Permissions to save or get file in S3
        lambdaPolicy.addActions("s3:ListBucket")
        lambdaPolicy.addActions("s3:getBucketLocation")
        lambdaPolicy.addActions("s3:GetObject")
        lambdaPolicy.addActions("s3:PutObject")
        lambdaPolicy.addResources(this.bucket.bucketArn)
        lambdaPolicy.addResources(
            `${this.bucket.bucketArn}/*`,
            `arn:aws:bedrock:*::foundation-model/*`
        )

        this.lambdaFunction = new Function(this, props.functionName, {
            functionName: props.functionName,
            handler: "handler.handler",
            runtime: Runtime.NODEJS_18_X,
            code: new AssetCode(`./src`),
            memorySize: 512,
            // role: lambdaRole,
            timeout: Duration.seconds(300),
            environment: {
                BUCKET: this.bucket.bucketName
            }
        })

        this.lambdaFunction.addToRolePolicy(lambdaPolicy)
        this.restApi.root.addMethod("POST", new LambdaIntegration(this.lambdaFunction, {}))


        // Add Amplify App for hosting the React frontend
        const amplifyApp = new App(this, "ReactApp", {
            sourceCodeProvider: new GitHubSourceCodeProvider({
                owner: "Ctrl-X",
                repository: "lambda-bedrock-image-description",
                oauthToken: SecretValue.secretsManager("github-token"), // Add this line to provide the GitHub access token
            }),
            buildSpec: BuildSpec.fromObjectToYaml({
                version: "1.0",
                frontend: {
                    phases: {
                        preBuild: {
                            commands: [
                                "cd public", // Change directory to the 'public' folder
                                "npm ci",
                            ],
                        },
                        build: {
                            commands: ["npm run build"],
                        },
                    },
                    artifacts: {
                        baseDirectory: "public/build", // Update the base directory to 'public/build'
                        files: ["**/*"],
                    },
                    cache: {
                        paths: ["public/node_modules/**/*"], // Update the cache path to 'public/node_modules'
                    },
                },
            }),
            environmentVariables: {
                REACT_APP_API_URL: this.restApi.url,
            },
        });
    }
}
