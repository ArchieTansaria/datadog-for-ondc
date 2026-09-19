import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Placeholder logic for now. 
  // In Phase 3, this will validate the ONDC payload, push to S3, and push to EventBridge.

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Event ingested successfully',
      message_id: 'mock-id'
    }),
  };
};
