import { LintOptions, ParserPreset, QualifiedConfig } from '@commitlint/types'
import load from '@commitlint/load'
import lint from '@commitlint/lint'
import { Options } from 'conventional-commits-parser'

function selectParserOpts(parserPreset: ParserPreset): Options | undefined {
  if (typeof parserPreset !== 'object') {
    return undefined
  }

  if (typeof parserPreset.parserOpts !== 'object') {
    return undefined
  }

  return parserPreset.parserOpts ?? undefined
}

function getLintOptions(configuration: QualifiedConfig): LintOptions {
  if (!configuration.parserPreset) {
    throw new Error('Missing parser preset')
  }

  const parserOpts = selectParserOpts(configuration.parserPreset)
  const opts: LintOptions = {
    parserOpts: {},
    plugins: {},
    ignores: [],
    defaultIgnores: true
  }
  if (parserOpts) {
    opts.parserOpts = parserOpts
  }
  if (configuration.plugins) {
    opts.plugins = configuration.plugins
  }
  if (configuration.ignores) {
    opts.ignores = configuration.ignores
  }
  if (!configuration.defaultIgnores) {
    opts.defaultIgnores = false
  }
  return opts
}

export async function lintPullRequest(
  title: string,
  configPath: string
): Promise<void> {
  const configuration = await load({}, { file: configPath, cwd: process.cwd() })

  const options = getLintOptions(configuration)

  const result = await lint(title, configuration.rules, options)

  if (result.valid) return
  const errorMessage = result.errors
    .map(({ message, name }) => `${name}:${message}`)
    .join('\n')
  throw new Error(errorMessage)
}
