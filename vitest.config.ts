import path from 'path'
import type {UserConfig} from 'vitest/config'

const config: {test: UserConfig['test']} = {
  test: {
    include: ['test/**/*.test.ts'],
    exclude: ['test/e2e/**'],
    alias: {
      '@commitlint/load': path.resolve(
        __dirname,
        'test/__mocks__/commitlint-load.ts'
      ),
      '@commitlint/lint': path.resolve(
        __dirname,
        'test/__mocks__/commitlint-lint.ts'
      )
    }
  }
}

export default config
