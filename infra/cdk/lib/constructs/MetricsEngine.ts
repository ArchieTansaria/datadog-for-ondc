import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export interface MetricsEngineProps {
  internalEventBus: events.IEventBus;
}

export class MetricsEngine extends Construct {
  public readonly engineLambda: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: MetricsEngineProps) {
    super(scope, id);

    this.engineLambda = new nodejs.NodejsFunction(this, 'MetricsEngineLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../../src/lambdas/metrics.ts'),
      handler: 'handler',
      environment: {
        EVENT_BUS_NAME: props.internalEventBus.eventBusName,
      },
    });

    // Create an EventBridge Rule to route metrics events to this Lambda
    new events.Rule(this, 'MetricsEngineRule', {
      eventBus: props.internalEventBus,
      eventPattern: {
        source: ['pulse.processor'],
        detailType: ['OrderMetricsEvent'], 
      },
      targets: [new targets.LambdaFunction(this.engineLambda)],
    });
  }
}
