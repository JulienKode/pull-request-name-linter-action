import {
  LintOptions,
  ParserOptions,
  ParserPreset,
  QualifiedConfig
} from '@commitlint/types'
import load from '@commitlint/load'
import lint from '@commitlint/lint'

function selectParserOpts(parserPreset: ParserPreset): object | null {
  if (typeof parserPreset !== 'object') {
    return null
  }

  if (typeof parserPreset.parserOpts !== 'object') {
    return null
  }

  return parserPreset.parserOpts
}

function getLintOptions(configuration: QualifiedConfig): LintOptions {
  const opts: LintOptions & {parserOpts: ParserOptions} = {
    parserOpts: {},
    plugins: {},
    ignores: [],
    defaultIgnores: true
  }
  if (configuration.parserPreset) {
    const parserOpts = selectParserOpts(configuration.parserPreset)
    if (parserOpts) opts.parserOpts = parserOpts
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
  const configuration = await load({}, {file: configPath, cwd: process.cwd()})

  const options = getLintOptions(configuration)

  const result = await lint(title, configuration.rules, options)

  if (result.valid) return
  const errorMessage = result.errors
    .map(({message, name}) => `${name}:${message}`)
    .join('\n')
  throw new Error(errorMessage)
}
