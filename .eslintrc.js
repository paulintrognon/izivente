module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'require-await': 'error',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-console': 'warn',
  },

  overrides: [
    /**
     * TypeScript Files
     */
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      rules: {
        // No unused variables
        '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      },
    },
    /**
     * Test files
     */
    {
      files: ['test/**/*'],
      env: { jest: true },
      rules: {},
    },
  ],
}
