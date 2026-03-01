import {describe, it, expect, beforeAll} from 'vitest'
import fs from 'fs'
import path from 'path'
import {runAction, eventFixture, configFixture} from './helpers/run-action'

const DIST_INDEX = path.resolve(__dirname, '..', '..', 'dist', 'index.js')

describe('E2E: dist/index.js', () => {
  beforeAll(() => {
    if (!fs.existsSync(DIST_INDEX)) {
      throw new Error(
        'dist/index.js does not exist. Run "pnpm build:pack" before running e2e tests.'
      )
    }
  })

  describe('valid PR titles', () => {
    it('should pass with a valid conventional commit title (scope-case)', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('valid-pr.json'),
        configPath: configFixture('scope-case.js')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(0)
      expect(result.stdout).not.toContain('::error::')
    })

    it('should pass with a valid title (type-enum)', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('valid-pr.json'),
        configPath: configFixture('type-enum.js')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(0)
      expect(result.stdout).not.toContain('::error::')
    })
  })

  describe('invalid PR titles', () => {
    it('should fail when scope is uppercase', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('invalid-pr-uppercase-scope.json'),
        configPath: configFixture('scope-case.js')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(1)
      expect(result.stdout, `stderr: ${result.stderr}`).toContain('::error::')
      expect(result.stdout).toContain('scope-case')
    })

    it('should fail when type is not in allowed list', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('invalid-pr-no-type.json'),
        configPath: configFixture('type-enum.js')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(1)
      expect(result.stdout, `stderr: ${result.stderr}`).toContain('::error::')
      expect(result.stdout).toContain('type-enum')
    })
  })

  describe('missing PR context', () => {
    it('should exit gracefully when event has no pull_request', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('no-pr.json'),
        configPath: configFixture('scope-case.js')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(0)
      expect(result.stdout).not.toContain('::error::')
    })
  })

  describe('default configuration path', () => {
    it('should use root commitlint.config.js when no config path is set', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('valid-pr.json')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(0)
      expect(result.stdout).not.toContain('::error::')
    })

    it('should fail with default config when scope is uppercase', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('invalid-pr-uppercase-scope.json')
      })

      expect(result.exitCode, `stderr: ${result.stderr}`).toBe(1)
      expect(result.stdout, `stderr: ${result.stderr}`).toContain('::error::')
    })
  })

  describe('error output format', () => {
    it('should output errors in GitHub Actions annotation format', async () => {
      const result = await runAction({
        eventPayloadPath: eventFixture('invalid-pr-uppercase-scope.json'),
        configPath: configFixture('scope-case.js')
      })

      const errorLines = result.stdout
        .split('\n')
        .filter(line => line.startsWith('::error::'))

      expect(errorLines.length, `stderr: ${result.stderr}\nstdout: ${result.stdout}`).toBeGreaterThan(0)
    })
  })
})
