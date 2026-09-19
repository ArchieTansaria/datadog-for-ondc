import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { FoundationStack } from '../../lib/stacks/FoundationStack';
import { MetricsStack } from '../../lib/stacks/MetricsStack';

describe('MetricsStack', () => {
  test('synthesizes the Metrics Engine resources', () => {
    const app = new App();
    const foundationStack = new FoundationStack(app, 'TestFoundationStack');
    
    const stack = new MetricsStack(app, 'TestMetricsStack', {
      internalEventBus: foundationStack.internalEventBus,
    });

    const template = Template.fromStack(stack);

    // It should create a Lambda function
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs22.x',
    });

    // It should create an EventBridge rule for the pulse.processor source
    template.hasResourceProperties('AWS::Events::Rule', {
      EventPattern: {
        source: ['pulse.processor'],
        'detail-type': ['OrderMetricsEvent'],
      },
      State: 'ENABLED',
    });
  });
});
