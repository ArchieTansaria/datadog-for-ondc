import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ApiStack } from '../lib/stacks/ApiStack';

describe('ApiStack', () => {
  let app: cdk.App;
  let stack: ApiStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    
    // Create a mock bucket and queue to pass as dependencies
    const dummyStack = new cdk.Stack(app, 'DummyStack');
    const dummyBucket = new s3.Bucket(dummyStack, 'DummyBucket');
    const dummyQueue = new sqs.Queue(dummyStack, 'DummyQueue');

    stack = new ApiStack(app, 'TestApiStack', {
      rawEventsBucket: dummyBucket,
      processingQueue: dummyQueue,
    });
    
    template = Template.fromStack(stack);
  });

  it('creates an API Gateway REST API with API Key required for POST /webhook', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'OndcIngestionApi',
    });
    
    // Check if a POST method exists and requires API Key
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ApiKeyRequired: true,
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
      },
    });
  });

  it('creates API Key and Usage Plan associated with the API stage', () => {
    template.hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Name: 'OndcWebhookApiKey',
    });

    template.hasResourceProperties('AWS::ApiGateway::UsagePlan', {
      UsagePlanName: 'OndcWebhookUsagePlan',
      ApiStages: Match.arrayWith([
        Match.objectLike({
          Stage: Match.anyValue()
        })
      ])
    });

    template.hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
      KeyType: 'API_KEY',
    });
  });

  it('creates a Node.js Lambda function for ingestion', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler', // Default for NodejsFunction
      Runtime: 'nodejs22.x',
    });
  });

  it('grants Lambda permissions to S3 and SQS, but NOT EventBridge', () => {
    // S3 put and SQS send message permission
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['s3:PutObject']),
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: Match.arrayWith(['sqs:SendMessage']),
            Effect: 'Allow',
          }),
        ]),
      },
    });

    // Verify it does NOT have EventBridge permission anymore
    const policies = template.findResources('AWS::IAM::Policy');
    const allStatements = Object.values(policies).flatMap(p => p.Properties.PolicyDocument.Statement);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasEventBridge = allStatements.some((s: any) => s.Action === 'events:PutEvents');
    expect(hasEventBridge).toBe(false);
  });
});
