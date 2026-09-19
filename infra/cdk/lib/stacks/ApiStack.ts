import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { IngestionApi } from '../constructs/IngestionApi';

export interface ApiStackProps extends StackProps {
  rawEventsBucket: s3.IBucket;
}

export class ApiStack extends Stack {
  public readonly ingestionApi: IngestionApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.ingestionApi = new IngestionApi(this, 'IngestionApi', {
      rawEventsBucket: props.rawEventsBucket,
    });
  }
}
