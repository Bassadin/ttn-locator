// import resetDb from './reset-db';
import { execSync } from 'child_process';
import { beforeEach } from 'vitest';
import { Client } from 'pg';

beforeAll(async () => {
    execSync('docker-compose -f docker-compose.test.yml up -d');

    console.log('Waiting for postgres to be ready...');

    const client = new Client({
        host: 'localhost',
        port: 57110,
        user: 'postgres',
        password: 'postgres',
        database: 'ttn-locator-backend_TEST',
    });

    try {
        await client.connect();
        console.log('Database is ready');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }

    console.log('Running migrations...');
    execSync('yarn prisma migrate dev --preview-feature');
    console.log('Migrations complete');
});

afterAll(async () => {
    execSync('docker-compose -f docker-compose.test.yml down');
});

beforeEach(async () => {
    // TODO re-enable this later when docker container works
    // await resetDb();
});
