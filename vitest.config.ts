import type {UserConfig} from 'vitest/config'

const config: {test: UserConfig['test']} = {
  test: {
    include: ['test/**/*.test.ts'],
    exclude: ['test/e2e/**']
  }
}

export default config
