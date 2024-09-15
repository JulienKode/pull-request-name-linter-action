import * as core from '@actions/core'
import * as github from '@actions/github'
import { lintPullRequest } from './linter.js'

async function run(): Promise<void> {
  try {
    const configPath = core.getInput('configuration-path', { required: true })
    const title = getPrTitle()
    if (!title) {
      core.debug('Could not get pull request title from context, exiting')
      return
    }
    await lintPullRequest(title, configPath)
  } catch (error) {
    if (error instanceof Error) {
      core.error(error)
      core.setFailed(error.message)
    } else {
      core.setFailed('Unknown error.')
    }
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
