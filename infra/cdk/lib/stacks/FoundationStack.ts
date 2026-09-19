import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IngestionStorage } from '../constructs/IngestionStorage';
import { ProcessingQueues } from '../constructs/ProcessingQueues';

export class FoundationStack extends Stack {
  public readonly ingestionStorage: IngestionStorage;
  public readonly processingQueues: ProcessingQueues;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.ingestionStorage = new IngestionStorage(this, 'IngestionStorage', {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    this.processingQueues = new ProcessingQueues(this, 'ProcessingQueues');
  }
}
