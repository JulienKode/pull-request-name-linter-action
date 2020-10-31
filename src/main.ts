import * as core from '@actions/core'
import * as github from '@actions/github'
import lint from '@commitlint/lint'
import load from '@commitlint/load'
import {
  LintOptions,
  ParserOptions, ParserPreset, QualifiedConfig
} from '@commitlint/types'

async function run(): Promise<void> {
  try {
    const configPath = core.getInput('configuration-path', {required: true})
    const title = getPrTitle()
    if (!title) {
      core.debug('Could not get pull request title from context, exiting')
      return
    }
    await lintPullRequest(title, configPath)
  } catch (error) {
    core.error(error)
    core.setFailed(error.message)
  }
}

function getPrTitle(): string | undefined {
  const pullRequest = github.context.payload.pull_request
  if (!pullRequest) {
    return undefined
  }

  return pullRequest.title
}

function selectParserOpts(parserPreset: ParserPreset) {
  if (typeof parserPreset !== 'object') {
    return undefined;
  }

  if (typeof parserPreset.parserOpts !== 'object') {
    return undefined;
  }

  return parserPreset.parserOpts;
}

function getLintOptions(configuration: QualifiedConfig): LintOptions {
  const parserOpts = selectParserOpts(configuration.parserPreset);
  const opts: LintOptions & {parserOpts: ParserOptions} = {
    parserOpts: {},
    plugins: {},
    ignores: [],
    defaultIgnores: true,
  };
  if (parserOpts) {
    opts.parserOpts = parserOpts;
  }
  if (configuration.plugins) {
    opts.plugins = configuration.plugins;
  }
  if (configuration.ignores) {
    opts.ignores = configuration.ignores;
  }
  if (!configuration.defaultIgnores) {
    opts.defaultIgnores = false;
  }
  return opts
}

export async function lintPullRequest(title: string, configPath: string) {
  const configuration = await load({}, {file: configPath, cwd: process.cwd()})

  const options = getLintOptions(configuration)

  const result = await lint(
    title,
    configuration.rules,
    options
  )

  if (result.valid) return

  const errorMessage = result.errors
    .map(({message, name}: any) => `${name}:${message}`)
    .join('\n')
  throw new Error(errorMessage)
}

run()
