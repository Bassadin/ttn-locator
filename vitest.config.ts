import path from 'path';
import { defineConfig } from 'vitest/config';

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
