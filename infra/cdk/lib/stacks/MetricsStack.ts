import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import { MetricsEngine } from '../constructs/MetricsEngine';

export interface MetricsStackProps extends StackProps {
  internalEventBus: events.IEventBus;
}

export class MetricsStack extends Stack {
  public readonly metricsEngine: MetricsEngine;

  constructor(scope: Construct, id: string, props: MetricsStackProps) {
    super(scope, id, props);

    this.metricsEngine = new MetricsEngine(this, 'MetricsEngine', {
      internalEventBus: props.internalEventBus,
    });
  }
}
