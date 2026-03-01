import type {UserConfig} from 'vitest/config'

const config: {test: UserConfig['test']} = {
  test: {
    include: ['test/e2e/**/*.test.ts'],
    testTimeout: 30000
  }
}

export default config
