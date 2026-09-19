import { App, Stack } from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ProcessingQueues } from '../../lib/constructs/ProcessingQueues';

describe('ProcessingQueues Construct', () => {
  test('creates a main processing queue and a DLQ', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    new ProcessingQueues(stack, 'Queues');

    const template = Template.fromStack(stack);

    // Verify DLQ exists
    template.resourceCountIs('AWS::SQS::Queue', 2);

    // Main queue should have a RedrivePolicy pointing to the DLQ
    template.hasResourceProperties('AWS::SQS::Queue', {
      RedrivePolicy: {
        deadLetterTargetArn: Match.anyValue(),
        maxReceiveCount: 5,
      },
      VisibilityTimeout: 30,
    });
  });
});
