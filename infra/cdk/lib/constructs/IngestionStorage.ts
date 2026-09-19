import { Construct } from 'constructs';
import { aws_s3 as s3, RemovalPolicy } from 'aws-cdk-lib';

export interface IngestionStorageProps {
  readonly removalPolicy?: RemovalPolicy;
  readonly autoDeleteObjects?: boolean;
}

export class IngestionStorage extends Construct {
  public readonly rawEventsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: IngestionStorageProps) {
    super(scope, id);

    this.rawEventsBucket = new s3.Bucket(this, 'RawEventsBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: props?.removalPolicy ?? RemovalPolicy.RETAIN,
      autoDeleteObjects: props?.autoDeleteObjects ?? false,
    });
  }
}
