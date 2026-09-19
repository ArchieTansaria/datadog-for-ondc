import { Construct } from 'constructs';
import { aws_sqs as sqs, Duration } from 'aws-cdk-lib';

export class ProcessingQueues extends Construct {
  public readonly dlq: sqs.Queue;
  public readonly mainQueue: sqs.Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.dlq = new sqs.Queue(this, 'DLQ', {
      retentionPeriod: Duration.days(14),
    });

    this.mainQueue = new sqs.Queue(this, 'MainQueue', {
      visibilityTimeout: Duration.seconds(30),
      deadLetterQueue: {
        queue: this.dlq,
        maxReceiveCount: 5,
      },
    });
  }
}
