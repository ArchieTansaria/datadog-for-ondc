import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambdaEventSources from 'aws-cdk-lib/aws-lambda-event-sources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Duration } from 'aws-cdk-lib';
import * as path from 'path';

export interface ProcessorServiceProps {
  processingQueue: sqs.IQueue;
  vpc: ec2.IVpc;
  databaseSecurityGroup: ec2.ISecurityGroup;
  databaseSecret: secretsmanager.ISecret;
}

export class ProcessorService extends Construct {
  public readonly processorLambda: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: ProcessorServiceProps) {
    super(scope, id);

    this.processorLambda = new lambdaNodejs.NodejsFunction(this, 'ProcessorLambda', {
      entry: path.join(__dirname, '../../src/lambdas/processor.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(5),
      memorySize: 1024,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      environment: {
        DATABASE_SECRET_ARN: props.databaseSecret.secretArn,
      },
      // Since it's interacting with the DB, let's bundle it properly
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Grant access to Aurora Secret
    props.databaseSecret.grantRead(this.processorLambda);

    // Allow Lambda to connect to Aurora PostgreSQL (port 5432)
    // We use CfnSecurityGroupIngress explicitly in this stack to prevent circular dependencies
    // that occur when mutating databaseSecurityGroup (which belongs to DatabaseStack).
    new ec2.CfnSecurityGroupIngress(this, 'ProcessorDbIngress', {
      ipProtocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      groupId: props.databaseSecurityGroup.securityGroupId,
      sourceSecurityGroupId: this.processorLambda.connections.securityGroups[0].securityGroupId,
      description: 'Allow Processor Lambda to connect to Aurora PostgreSQL',
    });

    // SQS Event Source Mapping
    this.processorLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(props.processingQueue, {
        batchSize: 10,
        reportBatchItemFailures: true,
      })
    );
  }
}
