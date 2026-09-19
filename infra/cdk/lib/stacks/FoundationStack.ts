import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IngestionStorage } from '../constructs/IngestionStorage';
import { ProcessingQueues } from '../constructs/ProcessingQueues';
import * as events from 'aws-cdk-lib/aws-events';

export class FoundationStack extends Stack {
  public readonly ingestionStorage: IngestionStorage;
  public readonly processingQueues: ProcessingQueues;
  public readonly internalEventBus: events.IEventBus;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ingestionStorage = new IngestionStorage(this, 'IngestionStorage', {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    this.processingQueues = new ProcessingQueues(this, 'ProcessingQueues');

    this.internalEventBus = new events.EventBus(this, 'InternalEventBus', {
      eventBusName: 'OndcPulseInternalBus',
    });
  }
}
