import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuroraDatabase } from '../constructs/AuroraDatabase';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class DatabaseStack extends Stack {
  public readonly database: AuroraDatabase;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.database = new AuroraDatabase(this, 'AuroraDatabase');

    // --- TEMPORARY MIGRATION LAMBDA ---
    const migrationSg = new ec2.SecurityGroup(this, 'MigrationLambdaSg', {
      vpc: this.database.vpc,
      description: 'Temporary SG for Migration Lambda',
      allowAllOutbound: true,
    });

    this.database.securityGroup.addIngressRule(
      migrationSg,
      ec2.Port.tcp(5432),
      'Allow Migration Lambda to connect to Aurora'
    );

    const migrationLambda = new nodejs.NodejsFunction(this, 'MigrationLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../../src/lambdas/migrate.ts'),
      handler: 'handler',
      timeout: Duration.minutes(5),
      vpc: this.database.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [migrationSg],
      environment: {
        DATABASE_SECRET_ARN: this.database.cluster.secret?.secretArn || '',
      },
      bundling: {
        minify: true,
        sourceMap: true,
        // Don't bundle these, we copy them manually
        externalModules: ['prisma', '@prisma/client', '@ondc-pulse/database'],
        commandHooks: {
          beforeBundling(_inputDir: string, _outputDir: string): string[] { return []; },
          beforeInstall(_inputDir: string, _outputDir: string): string[] { return []; },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              // 1. Setup dirs
              `mkdir -p ${outputDir}/node_modules`,
              
              // 2. Copy prisma CLI
              `cp -R ${inputDir}/node_modules/prisma ${outputDir}/node_modules/`,
              `cp -R ${inputDir}/node_modules/@prisma ${outputDir}/node_modules/`,
              
              // 3. Copy database package
              `mkdir -p ${outputDir}/node_modules/@ondc-pulse/database`,
              `cp -R ${inputDir}/packages/database/dist ${outputDir}/node_modules/@ondc-pulse/database/`,
              
              // 4. Copy migrations and schema to root of lambda
              `cp -R ${inputDir}/packages/database/prisma/migrations ${outputDir}/`,
              `cp ${inputDir}/packages/database/prisma/schema.prisma ${outputDir}/`,

              // 5. Explicitly generate and download the RHEL schema engine!
              // We do this inside the outputDir so that even if the host is a Mac, 
              // the output zip contains the RHEL engine.
              `cd ${outputDir} && PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x" npx prisma generate --schema=./schema.prisma`
            ];
          }
        }
      }
    });

    if (this.database.cluster.secret) {
      this.database.cluster.secret.grantRead(migrationLambda);
    }
  }
}

