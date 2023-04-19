module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: ['prettier', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    env: {
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'warn',

        // Ignore unused vars with underscore
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
};
