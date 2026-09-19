import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AuroraDatabase } from '../constructs/AuroraDatabase';

export class DatabaseStack extends Stack {
  public readonly database: AuroraDatabase;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.database = new AuroraDatabase(this, 'AuroraDatabase');
  }
}
