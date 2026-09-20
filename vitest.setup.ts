import { config } from 'dotenv';
import path from 'path';

// Load .env explicitly so integration tests can connect to the local DB
// without relying on Prisma's embedded directory path.
config({ path: path.resolve(__dirname, '.env') });
