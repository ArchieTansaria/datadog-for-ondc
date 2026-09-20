import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { ApiStack } from '../lib/stacks/ApiStack';

describe('ApiStack', () => {
  let app: cdk.App;
  let stack: ApiStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    
    const dummyStack = new cdk.Stack(app, 'DummyStack');
    const dummyBucket = s3.Bucket.fromBucketName(dummyStack, 'DummyBucket', 'dummy-bucket');
    const dummyQueue = sqs.Queue.fromQueueArn(dummyStack, 'DummyQueue', 'arn:aws:sqs:us-east-1:123456789012:dummy-queue');
    const dummyVpc = ec2.Vpc.fromVpcAttributes(dummyStack, 'DummyVpc', {
      vpcId: 'vpc-12345',
      availabilityZones: ['us-east-1a'],
      isolatedSubnetIds: ['subnet-12345'],
    });
    const dummySecurityGroup = ec2.SecurityGroup.fromSecurityGroupId(dummyStack, 'DummySG', 'sg-12345');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dummySecurityGroup.addIngressRule = (() => {}) as any;
    const dummySecret = secretsmanager.Secret.fromSecretNameV2(dummyStack, 'DummySecret', 'db-secret');

    stack = new ApiStack(app, 'TestApiStack', {
      rawEventsBucket: dummyBucket,
      processingQueue: dummyQueue,
      vpc: dummyVpc,
      databaseSecurityGroup: dummySecurityGroup,
      databaseSecret: dummySecret,
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

  it('creates Processor Lambda with SQS event source mapping, Secrets Manager access, and 5s timeout', () => {
    // Assert Lambda properties
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs20.x',
      Timeout: 5, // 5 seconds
      MemorySize: 1024,
      VpcConfig: Match.objectLike({
        SecurityGroupIds: Match.anyValue(),
        SubnetIds: Match.anyValue(),
      })
    });

    // Assert Event Source Mapping for SQS
    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      BatchSize: 10,
      FunctionResponseTypes: ['ReportBatchItemFailures'],
    });

    // Assert IAM policy for Secrets Manager
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith(['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret']),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  it('removes EventBridge SLA implementation and does not schedule it', () => {
    // Assert no EventBridge rules are created
    template.resourceCountIs('AWS::Events::Rule', 0);
  });
});
