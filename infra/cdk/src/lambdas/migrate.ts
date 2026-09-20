import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const secretsClient = new SecretsManagerClient({});

export const handler = async (_event: unknown) => {
  console.log('Migration Lambda invoked');
  
  const secretArn = process.env.DATABASE_SECRET_ARN;
  if (!secretArn) {
    throw new Error('DATABASE_SECRET_ARN is missing');
  }

  // 1. Fetch the secret
  const command = new GetSecretValueCommand({ SecretId: secretArn });
  const response = await secretsClient.send(command);

  if (!response.SecretString) {
    throw new Error('Secret string is empty');
  }

  const secret = JSON.parse(response.SecretString);
  const { username, password, host, port, dbname } = secret;

  if (!username || !password || !host || !port) {
    throw new Error('Database secret is missing required fields');
  }

  const databaseName = dbname && dbname !== 'postgres' ? dbname : 'ondc_pulse';

  const encodedUser = encodeURIComponent(username);
  const encodedPass = encodeURIComponent(password);
  const databaseUrl = `postgresql://${encodedUser}:${encodedPass}@${host}:${port}/${databaseName}?schema=public`;

  // 2. Set environment variable for Prisma
  process.env.DATABASE_URL = databaseUrl;

  console.log('Prepared DATABASE_URL. Starting migration...');

  try {
    // 3. Execute prisma migrate deploy
    // The prisma executable is bundled in node_modules/prisma/build/index.js
    const prismaPath = path.resolve(__dirname, 'node_modules/prisma/build/index.js');
    const schemaPath = path.resolve(__dirname, 'schema.prisma');
    
    if (!fs.existsSync(prismaPath)) {
      throw new Error(`Prisma executable not found at ${prismaPath}`);
    }
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Prisma schema not found at ${schemaPath}`);
    }

    const output = execSync(`node ${prismaPath} migrate deploy --schema ${schemaPath}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    console.log('Migration output:', output);
    return { success: true, output };
  } catch (error: unknown) {
    console.error('Migration failed');
    const err = error as { stdout?: Buffer | string; stderr?: Buffer | string };
    if (err.stdout) console.error('stdout:', err.stdout.toString());
    if (err.stderr) console.error('stderr:', err.stderr.toString());
    throw error;
  }
};
