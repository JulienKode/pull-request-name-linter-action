import {lintPullRequest} from '../src/linter'


test('should lint the title correctly', async () => {
  // Given
  const title = "feat(valid): scope"

  // Expect
  await expect(lintPullRequest(title, './commitlint.config.js')).resolves.toBeUndefined()
})

test('should raise errors', async () => {
  // Given
  const title = "feat(INVALID): scope"

  // Expect
  await expect(lintPullRequest(title, './commitlint.config.js')).rejects.toThrow()
})