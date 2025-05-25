import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

    console.log('Event: ', event);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello World!!!'
        })
    };

};