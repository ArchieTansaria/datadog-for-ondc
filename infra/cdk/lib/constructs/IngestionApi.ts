import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as events from 'aws-cdk-lib/aws-events';
import * as path from 'path';

export interface IngestionApiProps {
  rawEventsBucket: s3.IBucket;
}

export class IngestionApi extends Construct {
  public readonly api: apigateway.RestApi;
  public readonly ingestLambda: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: IngestionApiProps) {
    super(scope, id);

    // 1. Create the Lambda Function
    this.ingestLambda = new nodejs.NodejsFunction(this, 'IngestValidateLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../../src/lambdas/ingest.ts'),
      handler: 'handler',
      environment: {
        RAW_EVENTS_BUCKET: props.rawEventsBucket.bucketName,
      },
    });

    // 2. Grant permissions to S3 and EventBridge
    props.rawEventsBucket.grantPut(this.ingestLambda);
    events.EventBus.grantAllPutEvents(this.ingestLambda);

    // 3. Create the API Gateway REST API
    this.api = new apigateway.RestApi(this, 'OndcIngestionApi', {
      restApiName: 'OndcIngestionApi',
      description: 'API Gateway for receiving ONDC webhooks',
    });

    // 4. Add the /webhook resource and POST method
    const webhookResource = this.api.root.addResource('webhook');
    const lambdaIntegration = new apigateway.LambdaIntegration(this.ingestLambda);
    
    webhookResource.addMethod('POST', lambdaIntegration);
  }
}
