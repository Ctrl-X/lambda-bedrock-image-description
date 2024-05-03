import { Duration, SecretValue, Stack, StackProps } from "aws-cdk-lib"
import { App, GitHubSourceCodeProvider } from "@aws-cdk/aws-amplify-alpha"
import { Construct } from "constructs"

export class AmplifyInfraStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        // You must create a secret to store your github Personnal access token
        //@see https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens



        // Creation of the Amplify Application
        const amplifyApp = new App(this, "productDescr-frontend ", {
            sourceCodeProvider: new GitHubSourceCodeProvider({
                owner: "Ctrl-X",
                repository: "lambda-bedrock-image-description",
                oauthToken: SecretValue.secretsManager("github-token", {
                    jsonField: "token",
                }),
            }),
        })
        const masterBranch = amplifyApp.addBranch("main")
    }
}
