module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true }, // Compatibilidade back/front
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
<<<<<<< HEAD
    'plugin:prettier/recommended',
=======
>>>>>>> origin/main
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
<<<<<<< HEAD
  plugins: ['react-refresh', 'jsx-a11y', 'import'],
=======
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['react-refresh', 'jsx-a11y', 'import'],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true
    }
  },
>>>>>>> origin/main
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/strict-boolean-expressions': 'off', // Ativado via TSConfig strict, mas aqui como placeholder se necessário regra explicita
    'jsx-a11y/alt-text': 'error',
    'react/prop-types': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'import/no-unresolved': 'error',
    'import/order': [
      'warn',
<<<<<<< HEAD
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
=======
      { allowConstantExport: true },
    ],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    '@typescript-eslint/strict-boolean-expressions': 'warn'
>>>>>>> origin/main
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json']
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
}
