export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'ui',
        'db',
        'core',
        'config',
        'deps',
        'docs',
        'auth',
        'tools',
        'server'
      ]
    ],
  }
};
