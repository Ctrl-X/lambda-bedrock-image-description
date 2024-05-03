import { Duration, SecretValue, Stack, StackProps } from "aws-cdk-lib"
import { App, GitHubSourceCodeProvider } from "@aws-cdk/aws-amplify-alpha"
import { Construct } from "constructs"
import * as iam from "aws-cdk-lib/aws-iam"

export class AmplifyInfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // You must create a secret to store your github Personnal access token
        //@see https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

        // Create an IAM role for Amplify
        const amplifyRole = new iam.Role(this, "AmplifyRole", {
            assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
        })

        // Attach the necessary permissions to the role
        amplifyRole.addManagedPolicy(
            iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess-Amplify"),
        )

        // Creation of the Amplify Application
        const amplifyApp = new App(this, "productDescr-frontend ", {
            sourceCodeProvider: new GitHubSourceCodeProvider({
                owner: "Ctrl-X",
                repository: "lambda-bedrock-image-description",
                oauthToken: SecretValue.secretsManager("github-token", {
                    jsonField: "token",
                }),
            }),
            role: amplifyRole, // Associate the IAM role with the Amplify app
        })
        const masterBranch = amplifyApp.addBranch("main")
    }
}
