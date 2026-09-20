import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Duration } from 'aws-cdk-lib';
import * as path from 'path';

export interface SlaEngineProps {
  vpc: ec2.IVpc;
  databaseSecurityGroup: ec2.ISecurityGroup;
  databaseSecret: secretsmanager.ISecret;
}

export class SlaEngine extends Construct {
  public readonly slaEngineLambda: lambdaNodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: SlaEngineProps) {
    super(scope, id);

    this.slaEngineLambda = new lambdaNodejs.NodejsFunction(this, 'SlaEngineLambda', {
      entry: path.join(__dirname, '../../src/lambdas/sla-engine.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: Duration.seconds(15),
      memorySize: 512,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      environment: {
        DATABASE_SECRET_ARN: props.databaseSecret.secretArn,
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['@prisma/client', 'prisma', '@ondc-pulse/database'],
        commandHooks: {
          beforeBundling(inputDir: string, _outputDir: string): string[] {
            return [`cd ${inputDir}/packages/database && npx prisma generate`];
          },
          beforeInstall(_inputDir: string, _outputDir: string): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              `mkdir -p ${outputDir}/node_modules/.prisma`,
              `mkdir -p ${outputDir}/node_modules/@prisma`,
              `mkdir -p ${outputDir}/node_modules/@ondc-pulse/database`,
              `cp -R ${inputDir}/node_modules/.prisma/client ${outputDir}/node_modules/.prisma/`,
              `cp -R ${inputDir}/node_modules/@prisma/client ${outputDir}/node_modules/@prisma/`,
              `cp -R ${inputDir}/packages/database/dist ${outputDir}/node_modules/@ondc-pulse/database/`,
              `cp ${inputDir}/packages/database/package.json ${outputDir}/node_modules/@ondc-pulse/database/`,
              `rm -f ${outputDir}/node_modules/.prisma/client/libquery_engine-darwin*.node`
            ];
          },
        },
      },
    });

    // Grant access to Aurora Secret
    props.databaseSecret.grantRead(this.slaEngineLambda);

    // Allow Lambda to connect to Aurora PostgreSQL (port 5432)
    new ec2.CfnSecurityGroupIngress(this, 'SlaEngineDbIngress', {
      ipProtocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      groupId: props.databaseSecurityGroup.securityGroupId,
      sourceSecurityGroupId: this.slaEngineLambda.connections.securityGroups[0].securityGroupId,
      description: 'Allow SLA Engine Lambda to connect to Aurora PostgreSQL',
    });

    // Schedule the lambda to run every minute
    const rule = new events.Rule(this, 'SlaEngineCronRule', {
      schedule: events.Schedule.rate(Duration.minutes(1)),
    });
    
    rule.addTarget(new targets.LambdaFunction(this.slaEngineLambda));
  }
}
