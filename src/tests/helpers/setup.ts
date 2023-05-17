import { execSync } from 'child_process';
import { beforeEach } from 'vitest';
import resetDb from './reset-db';

beforeEach(async () => {
    // await resetDb();
    // execSync('npx prisma migrate reset --force');
});
