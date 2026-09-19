import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';

export interface AuroraDatabaseProps {
  vpc?: ec2.IVpc;
}

export class AuroraDatabase extends Construct {
  public readonly vpc: ec2.IVpc;
  public readonly cluster: rds.DatabaseCluster;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: AuroraDatabaseProps) {
    super(scope, id);

    // 1. Create a VPC with isolated subnets across at least 2 AZs if one isn't provided
    this.vpc = props?.vpc ?? new ec2.Vpc(this, 'DatabaseVpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // 2. Create Security Group for the Database
    this.securityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Aurora PostgreSQL Database',
      allowAllOutbound: true,
    });
    // Note: We do NOT allow 0.0.0.0/0 on port 5432.
    // Applications/Lambdas will need to be granted access later via `this.securityGroup.addIngressRule(...)`

    // 3. Create Aurora Serverless v2 PostgreSQL Cluster
    this.cluster = new rds.DatabaseCluster(this, 'AuroraCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_14, // Highly compatible with Prisma
      }),
      writer: rds.ClusterInstance.serverlessV2('Writer'),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 2,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [this.securityGroup],
      storageEncrypted: true,
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      
      // DO NOT expose publicly
      defaultDatabaseName: 'ondc_pulse',
      
      // Hackathon/Development removal policy
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 4. Add VPC Interface Endpoint for Secrets Manager
    // This allows Lambdas in the isolated subnets to fetch the DB credentials
    this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      privateDnsEnabled: true,
    });
  }
}
