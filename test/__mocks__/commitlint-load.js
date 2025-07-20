module.exports = jest.fn().mockImplementation(async (config, options) => {
  // Mock configuration object that mimics @commitlint/load behavior
  return {
    extends: [],
    formatter: '@commitlint/format',
    rules: {
      'scope-case': [2, 'always', 'lower-case']
    },
    parserPreset: undefined,
    ignores: [],
    defaultIgnores: true,
    plugins: {},
    helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
  };
});