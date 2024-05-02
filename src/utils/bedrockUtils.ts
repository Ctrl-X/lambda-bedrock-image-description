import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

// Initialize the Bedrock client with your region
const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" })

async function describePicture(image: any) {
    // Convert image Buffer to a Base64 string
    const buffer = Buffer.from(image.content, "binary")
     const base64Image = buffer.toString('base64');

    // prepare Claude 3 prompt
    const params = {
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 2048,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": base64Image
                            }
                        },
                        {
                            "type": "text",
                            "text" : "Claude 3 Sonnet, I am providing you with an image of a product. Based on the visual information available, please analyze the image and generate a JSON object containing the following attributes: \"product_name\", \"product_brand\", \"description\", \"format_size\", and \"category\". The \"description\" should be a concise phrase of no more than 20 words that captures the essence of the product. The \"format_size\" should specify the quantity in units such as grams, milliliters, or kilograms. The \"category\" should be a general classification of the product such as food, furniture, well-being, outfit, beverage,fresh food,etc. Ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes.If you don't find the information leave the attribute empty.Only take english words from the picture. Here is the image:"
                        }
                    ]
                },
            ],
        }),
    }

    // Create the command object
    const command = new InvokeModelCommand(params)

    try {
        // Use the client to send the command
        const response = await bedrockClient.send(command)
        const textDecoder = new TextDecoder("utf-8")
        const response_body = JSON.parse(textDecoder.decode(response.body))
        console.log("response_body",response_body)
        const productInfo =  JSON.parse(response_body.content[0].text)
        return {
            statusCode: 200,
            productInfo
        }
    } catch (err: any) {
        console.error("Error invoking Bedrock:", err)
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message,
            }),
        }
    }
}

export default describePicture
