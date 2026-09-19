import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { IngestionStorage } from '../../lib/constructs/IngestionStorage';

describe('IngestionStorage Construct', () => {
  test('creates an S3 bucket with secure defaults for production', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new IngestionStorage(stack, 'Storage', {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const template = Template.fromStack(stack);

    // Verify bucket exists
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      },
      VersioningConfiguration: {
        Status: 'Enabled',
      },
    });

    // Enforce SSL is usually applied via a BucketPolicy
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 's3:*',
            Condition: {
              Bool: {
                'aws:SecureTransport': 'false',
              },
            },
            Effect: 'Deny',
            Principal: { AWS: '*' },
          },
        ],
      },
    });
  });

  test('creates an S3 bucket with DESTROY policy for dev', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new IngestionStorage(stack, 'Storage', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const template = Template.fromStack(stack);

    template.hasResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });
  });
});
