import path from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// Load .env.test file for environment variables
config({ path: resolve(__dirname, '.env.test') });

export default defineConfig({
    test: {
        // globals: true,
        // environment: 'jsdom',
        include: ['src/**/*.spec.ts'],
        threads: false,
        setupFiles: ['src/tests/helpers/setup.ts'],
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
