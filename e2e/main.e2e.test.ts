import {execFileSync, ExecFileSyncOptions} from 'child_process'
import path from 'path'

const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_INDEX = path.join(ROOT_DIR, 'dist', 'index.js')
const FIXTURES_DIR = path.join(__dirname, 'fixtures')
const COMMITLINT_CONFIG = path.join(ROOT_DIR, 'commitlint.config.js')

interface ExecError {
  status: number | null
  stdout: Buffer | null
  stderr: Buffer | null
}

function isExecError(error: unknown): error is ExecError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'stdout' in error &&
    'stderr' in error
  )
}

function runAction(eventPath: string): {exitCode: number; output: string} {
  const options: ExecFileSyncOptions = {
    cwd: ROOT_DIR,
    env: {
      ...process.env,
      GITHUB_EVENT_PATH: eventPath,
      'INPUT_CONFIGURATION-PATH': COMMITLINT_CONFIG
    }
  }

  try {
    const output = execFileSync('node', [DIST_INDEX], options)
    return {exitCode: 0, output: output?.toString() ?? ''}
  } catch (error) {
    if (isExecError(error)) {
      return {
        exitCode: error.status ?? 1,
        output: `${error.stdout?.toString() ?? ''}\n${
          error.stderr?.toString() ?? ''
        }`
      }
    }
    return {exitCode: 1, output: String(error)}
  }
}

describe('E2E: Pull Request Linter Action', () => {
  test('should succeed with valid PR title', () => {
    const eventPath = path.join(FIXTURES_DIR, 'valid-pr-event.json')
    const result = runAction(eventPath)

    expect(result.exitCode).toBe(0)
  })

  test('should fail with invalid PR title (uppercase scope)', () => {
    const eventPath = path.join(FIXTURES_DIR, 'invalid-pr-event.json')
    const result = runAction(eventPath)

    expect(result.exitCode).not.toBe(0)
    expect(result.output).toContain('scope-case')
  })
})
