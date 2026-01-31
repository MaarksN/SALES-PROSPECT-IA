export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'ci'
    ]],
    'scope-enum': [2, 'always', [
      'api', 'ui', 'db', 'infra', 'ai'
    ]],
    'header-max-length': [2, 'always', 72],
    'body-min-length': [2, 'always', 10]
  }
};
