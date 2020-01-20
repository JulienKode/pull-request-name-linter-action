[![Actions Status](https://github.com/JulienKode/pull-request-name-linter-action/workflows/build-test/badge.svg)](https://github.com/JulienKode/pull-request-name-linter-action/actions)

**GitHub action** to automatically **lint pull request name** with [**commitlint**](https://commitlint.js.org).
This is useful if squash merge your pull request for example.

**Note**: If you are looking to lint the commits of your pull request with commitlint you can use [commitlint-github-action](https://github.com/wagoid/commitlint-github-action)

# Pull request name linter with commitlint

## Configuration

## Usage

### Create `.github/workflows/pr-name.yml`

Create a workflow (eg: `.github/workflows/pr-name.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)).
Here is an example of configuration

```yaml
name: pr-name-linter
on:
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
    - uses: JulienKode/pull-request-name-linter-action@v0.1.0
```
