import { APIGatewayProxyResultV2, SQSEvent } from 'aws-lambda';


export async function handler(event: SQSEvent): Promise<APIGatewayProxyResultV2> {
  try {
    console.log(JSON.stringify(event));
    console.log('--------------------------------')
    console.log(JSON.stringify(event.Records));

    return sendSuccess("send sms request");
  } catch (error) {
    return sendFail(`Invalid request: ${error}`);
  }
}


export function sendFail(message: string): APIGatewayProxyResultV2 {
  return {
    statusCode: 400,
    body: JSON.stringify({ message }),
  };
}

export function sendSuccess(body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
}
