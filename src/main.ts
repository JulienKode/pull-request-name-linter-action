import * as core from '@actions/core'
import * as github from '@actions/github'
import {lintPullRequest} from './linter'

async function run(): Promise<void> {
  try {
    core.debug(
      `RAW INPUT_CONFIGURATION-PATH env: ${process.env['INPUT_CONFIGURATION-PATH']}`
    )
    const configPath =
      core.getInput('configuration-path') || './commitlint.config.js'
    const title = getPrTitle()
    if (!title) {
      core.debug('Could not get pull request title from context, exiting')
      return
    }
    await lintPullRequest(title, configPath)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    core.error(errorMessage)
    core.setFailed(errorMessage)
  }
}

function getPrTitle(): string | undefined {
  const pullRequest = github.context.payload.pull_request
  if (!pullRequest) {
    return undefined
  }

  return pullRequest.title
}

run()
