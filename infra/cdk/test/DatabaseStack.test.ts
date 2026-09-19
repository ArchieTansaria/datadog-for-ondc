import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { DatabaseStack } from '../lib/stacks/DatabaseStack';

describe('DatabaseStack', () => {
  let app: cdk.App;
  let stack: DatabaseStack;
  let template: Template;

  beforeAll(() => {
    app = new cdk.App();
    stack = new DatabaseStack(app, 'TestDatabaseStack');
    template = Template.fromStack(stack);
  });

  it('creates a VPC with at least two isolated subnets', () => {
    template.resourceCountIs('AWS::EC2::VPC', 1);

    // Should have ISOLATED subnets (AWS CDK uses SubnetType.ISOLATED which typically translates to subnets with no route to IGW or NAT)
    template.hasResourceProperties('AWS::EC2::Subnet', {
      MapPublicIpOnLaunch: false,
    });
    
    // Ensure we have at least 2 subnets for high availability
    // CDK creates 1 subnet per AZ by default for a given SubnetType if maxAzs is not limited below 2.
    // We expect at least 2 isolated subnets.
    const subnets = template.findResources('AWS::EC2::Subnet');
    expect(Object.keys(subnets).length).toBeGreaterThanOrEqual(2);
  });

  it('creates an Aurora PostgreSQL cluster', () => {
    template.hasResourceProperties('AWS::RDS::DBCluster', {
      Engine: 'aurora-postgresql',
      // Should be using Serverless V2. For CDK, serverless v2 is typically defined by ServerlessV2ScalingConfiguration
      ServerlessV2ScalingConfiguration: {
        MinCapacity: 0.5,
        MaxCapacity: 2,
      },
      StorageEncrypted: true,
      PubliclyAccessible: Match.absent(), // Should not be publicly accessible
    });
  });

  it('uses Secrets Manager for credentials', () => {
    // The MasterUserPassword should be dynamically generated via Secrets Manager
    template.hasResourceProperties('AWS::RDS::DBCluster', {
      MasterUsername: 'postgres',
      MasterUserPassword: Match.anyValue(), // We can't strictly assert the exact CloudFormation dynamic ref here easily in Match without knowing the exact logical ID, but we expect it to be present.
    });
    
    // Ensure a Secret is created
    template.resourceCountIs('AWS::SecretsManager::Secret', 1);
  });

  it('secures port 5432 and does not open it to the internet', () => {
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: Match.stringLikeRegexp('.*'),
      // Security Group Ingress shouldn't have 0.0.0.0/0 for port 5432
      SecurityGroupIngress: Match.not(Match.arrayWith([
        Match.objectLike({
          CidrIp: '0.0.0.0/0',
          FromPort: 5432,
          ToPort: 5432,
        })
      ]))
    });
  });

  it('sets appropriate development removal policy (DESTROY)', () => {
    // We expect development stacks to clean up resources, though DB clusters 
    // might require Snapshot in prod. For hackathon, DESTROY is typical.
    // In CDK assertions, RemovalPolicy translates to DeletionPolicy / UpdateReplacePolicy
    template.hasResource('AWS::RDS::DBCluster', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });
});
