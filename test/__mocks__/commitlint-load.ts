import {vi} from 'vitest'

export default vi.fn().mockImplementation(async () => {
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
    helpUrl:
      'https://github.com/conventional-changelog/commitlint/#what-is-commitlint'
  }
})
