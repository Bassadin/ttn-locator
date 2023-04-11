import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    // https://stackoverflow.com/a/50863753/3526350
    roots: ['<rootDir>/src'],
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules'],
};

export default config;
