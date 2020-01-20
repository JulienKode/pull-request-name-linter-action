import * as core from '@actions/core'
import * as github from '@actions/github'
import lint from '@commitlint/lint'
import load from '@commitlint/load'

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

export async function lintPullRequest(title: string, configPath: string) {
  const opts = await load({}, {file: configPath, cwd: process.cwd()})

  const result = await lint(
    title,
    opts.rules,
    opts.parserPreset ? {parserOpts: opts.parserPreset.parserOpts} : {}
  )
  if (result.valid === true) return

  const errorMessage = result.errors
    .map(({message, name}: any) => `${name}:${message}`)
    .join('\n')
  throw new Error(errorMessage)
}

run()
