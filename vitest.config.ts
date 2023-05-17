import path from 'path';
import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

// Load .env.test file for environment variables
config({ path: '.env.test' });

export default defineConfig({
    test: {
        // globals: true,
        // environment: 'jsdom',
        include: ['src/**/*.spec.ts'],
        threads: false,
        setupFiles: ['src/tests/helpers/setup.ts'],
        globalSetup: ['src/tests/helpers/globalSetupAndTeardown.mjs'],
        globals: true,
        coverage: {
            provider: 'istanbul', // or 'c8'
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
