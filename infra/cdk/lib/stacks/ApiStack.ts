import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { IngestionApi } from '../constructs/IngestionApi';
import { ProcessorService } from '../constructs/ProcessorService';
import { SlaEngine } from '../constructs/SlaEngine';

export interface ApiStackProps extends StackProps {
  rawEventsBucket: s3.IBucket;
  processingQueue: sqs.IQueue;
  vpc: ec2.IVpc;
  databaseSecurityGroup: ec2.ISecurityGroup;
  databaseSecret: secretsmanager.ISecret;
}

export class ApiStack extends Stack {
  public readonly ingestionApi: IngestionApi;
  public readonly processorService: ProcessorService;
  public readonly slaEngine: SlaEngine;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    this.ingestionApi = new IngestionApi(this, 'IngestionApi', {
      rawEventsBucket: props.rawEventsBucket,
      processingQueue: props.processingQueue,
    });

    this.processorService = new ProcessorService(this, 'ProcessorService', {
      processingQueue: props.processingQueue,
      vpc: props.vpc,
      databaseSecurityGroup: props.databaseSecurityGroup,
      databaseSecret: props.databaseSecret,
    });

    this.slaEngine = new SlaEngine(this, 'SlaEngine', {
      vpc: props.vpc,
      databaseSecurityGroup: props.databaseSecurityGroup,
      databaseSecret: props.databaseSecret,
    });
  }
}
