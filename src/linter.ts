import load from '@commitlint/load'
import lint from '@commitlint/lint'

type Configuration = Awaited<ReturnType<typeof load>>
type LintOpts = NonNullable<Parameters<typeof lint>[2]>

function selectParserOpts(
  parserPreset: Configuration['parserPreset']
): object | null {
  if (typeof parserPreset !== 'object' || !parserPreset) {
    return null
  }

  if (typeof parserPreset.parserOpts !== 'object') {
    return null
  }

  return parserPreset.parserOpts
}

function getLintOptions(configuration: Configuration): LintOpts {
  const opts: LintOpts = {
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
