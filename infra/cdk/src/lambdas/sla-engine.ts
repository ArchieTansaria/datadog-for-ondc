import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let isDbConfigured = false;
export const resetDbConfigForTesting = () => { isDbConfigured = false; };
const secretsClient = new SecretsManagerClient({});

const configureDatabase = async () => {
  if (isDbConfigured) return;

  const secretArn = process.env.DATABASE_SECRET_ARN;
  if (!secretArn) {
    throw new Error('DATABASE_SECRET_ARN environment variable is missing');
  }

  const response = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretArn }));
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

  process.env.DATABASE_URL = databaseUrl;
  isDbConfigured = true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any): Promise<void> => {
  console.log('SLA Engine started', new Date().toISOString());
  
  try {
    await configureDatabase();
  } catch (error) {
    console.error('Failed to configure database:', error);
    throw error;
  }

  const { prisma } = await import('@ondc-pulse/database');

  try {
    // 1. Fetch active SLA rules
    const slaRules = await prisma.sLARule.findMany({
      where: { enabled: true }
    });

    for (const rule of slaRules) {
      const thresholdDate = new Date(Date.now() - rule.thresholdMs);
      
      // 2. Find orders stuck in the current state beyond the threshold
      const stuckOrders = await prisma.order.findMany({
        where: {
          tenantId: rule.tenantId,
          currentState: rule.fromState,
          lastEventAt: { lt: thresholdDate }
        }
      });

      // 3. For each stuck order, check if an incident already exists
      for (const order of stuckOrders) {
        const existingIncident = await prisma.incident.findFirst({
          where: {
            orderId: order.id,
            incidentType: 'SLA_BREACH',
            status: { in: ['OPEN', 'ACKNOWLEDGED'] }
          }
        });

        if (!existingIncident) {
          console.log(`SLA Breach detected for Order: ${order.id}. State: ${order.currentState}, threshold: ${rule.thresholdMs}ms`);
          
          await prisma.incident.create({
            data: {
              tenantId: order.tenantId,
              orderId: order.id,
              incidentType: 'SLA_BREACH',
              severity: rule.severity,
              status: 'OPEN',
              title: `SLA Breach: ${rule.name}`,
              description: `Order has been stuck in state ${order.currentState} for more than ${rule.thresholdMs}ms.`,
              detectedAt: new Date(),
              metadata: {
                ruleId: rule.id,
                ruleName: rule.name,
                fromState: rule.fromState,
                toState: rule.toState,
                thresholdMs: rule.thresholdMs,
                lastEventAt: order.lastEventAt.toISOString()
              }
            }
          });
        }
      }
    }
    
    console.log('SLA Engine completed successfully.');
  } catch (error) {
    console.error('SLA Engine failed during execution:', error);
    throw error;
  }
};
