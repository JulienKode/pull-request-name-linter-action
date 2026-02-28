import {test, expect} from 'vitest'
import path from 'path'
import {lintPullRequest} from '../src/linter'

const scopeCaseConfig = path.resolve(
  __dirname,
  'e2e/fixtures/configs/scope-case.js'
)

test('should lint the title correctly', async () => {
  await expect(
    lintPullRequest('feat(valid): scope', scopeCaseConfig)
  ).resolves.toBeUndefined()
})

test('should raise errors', async () => {
  await expect(
    lintPullRequest('feat(INVALID): scope', scopeCaseConfig)
  ).rejects.toThrow()
})
