import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ApiStack } from '../lib/stacks/ApiStack';

describe('ApiStack', () => {
  let app: cdk.App;
  let stack: ApiStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    
    // Create a mock bucket to pass as dependency
    const dummyStack = new cdk.Stack(app, 'DummyStack');
    const dummyBucket = new s3.Bucket(dummyStack, 'DummyBucket');

    stack = new ApiStack(app, 'TestApiStack', {
      rawEventsBucket: dummyBucket,
    });
    
    template = Template.fromStack(stack);
  });

  it('creates an API Gateway REST API', () => {
    template.hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'OndcIngestionApi',
    });
    
    // Check if a POST method exists
    template.hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS_PROXY',
      },
    });
  });

  it('creates a Node.js Lambda function for ingestion', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler', // Default for NodejsFunction
      Runtime: 'nodejs22.x',
    });
  });

  it('grants Lambda permissions to the S3 bucket and EventBridge', () => {
    // Both S3 put and EventBridge put events permission should be in the same policy document
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['s3:PutObject']),
            Effect: 'Allow',
          }),
          Match.objectLike({
            Action: 'events:PutEvents',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });
});
