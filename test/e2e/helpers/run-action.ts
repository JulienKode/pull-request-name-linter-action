import {execFile} from 'child_process'
import path from 'path'

interface RunActionOptions {
  eventPayloadPath: string
  configPath?: string
}

interface RunActionResult {
  exitCode: number
  stdout: string
  stderr: string
}

const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..')
const DIST_INDEX = path.join(PROJECT_ROOT, 'dist', 'index.js')

export function runAction(options: RunActionOptions): Promise<RunActionResult> {
  return new Promise(resolve => {
    const env: Record<string, string> = {
      GITHUB_EVENT_PATH: options.eventPayloadPath,
      GITHUB_EVENT_NAME: 'pull_request',
      GITHUB_REPOSITORY: 'test-owner/test-repo',
      GITHUB_WORKSPACE: PROJECT_ROOT,
      PATH: process.env.PATH || '',
      HOME: process.env.HOME || ''
    }

    if (options.configPath) {
      env['INPUT_CONFIGURATION-PATH'] = options.configPath
    }

    execFile(
      process.execPath,
      [DIST_INDEX],
      {env, cwd: PROJECT_ROOT, timeout: 15000},
      (error, stdout, stderr) => {
        resolve({
          exitCode:
            error && 'code' in error && typeof error.code === 'number'
              ? error.code
              : error
                ? 1
                : 0,
          stdout: stdout || '',
          stderr: stderr || ''
        })
      }
    )
  })
}

export const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures')

export function eventFixture(name: string): string {
  return path.join(FIXTURES_DIR, 'events', name)
}

export function configFixture(name: string): string {
  return path.join(FIXTURES_DIR, 'configs', name)
}
