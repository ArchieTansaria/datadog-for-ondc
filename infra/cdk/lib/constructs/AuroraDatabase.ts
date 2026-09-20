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

    // 1. Create a VPC with isolated and public subnets
    this.vpc = props?.vpc ?? new ec2.Vpc(this, 'OndcDatabaseVpc', {
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        }
      ],
    });

    // 2. Create Security Group for the Database
    this.securityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
      vpc: this.vpc,
      description: 'Security group for Aurora PostgreSQL Database',
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), 'Allow public access');

    // 3. Create Aurora Serverless v2 PostgreSQL Cluster
    this.cluster = new rds.DatabaseCluster(this, 'AuroraClusterV2', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_14, // Highly compatible with Prisma
      }),
      writer: rds.ClusterInstance.serverlessV2('Writer', {
        publiclyAccessible: true,
      }),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 2,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [this.securityGroup],
      storageEncrypted: true,
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      
      // Public for demo purposes
      defaultDatabaseName: 'ondc_pulse',
      
      // Hackathon/Development removal policy
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 4. Add VPC Interface Endpoint for Secrets Manager
    // This allows Lambdas in the isolated subnets to fetch the DB credentials
    this.vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnetType: ec2.SubnetType.PUBLIC },
      privateDnsEnabled: true,
    });
  }
}
