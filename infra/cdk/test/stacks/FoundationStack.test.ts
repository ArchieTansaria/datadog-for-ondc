import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { FoundationStack } from '../../lib/stacks/FoundationStack';

describe('FoundationStack', () => {
  test('synthesizes the expected foundational resources', () => {
    const app = new App();
    const stack = new FoundationStack(app, 'TestFoundationStack');

    const template = Template.fromStack(stack);

    // It should have the S3 bucket
    template.hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: { Status: 'Enabled' },
    });

    // It should have 2 queues (Main + DLQ)
    template.resourceCountIs('AWS::SQS::Queue', 2);
  });
});
