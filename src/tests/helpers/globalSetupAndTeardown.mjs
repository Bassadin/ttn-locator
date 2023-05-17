import { execSync } from 'child_process';
import { waitForPostgres } from '@jcoreio/wait-for-postgres';

export async function setup() {
    execSync('docker-compose -f docker-compose.test.yml up -d');

    console.log('Waiting for postgres to be ready...');

    await waitForPostgres({
        host: 'localhost',
        port: 57110,
        user: 'postgres',
        password: 'postgres',
        database: 'ttn-locator-backend_TEST',
        timeout: 10 * 1000,
    });

    console.log('Running migrations...');
    execSync('npx prisma migrate reset --force');
    console.log('Migrations complete');
}

export async function teardown() {
    execSync('docker-compose -f docker-compose.test.yml down');
}
