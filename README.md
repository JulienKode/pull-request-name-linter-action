# ⚡️ Pull request name linter with commitlint ⚡️
---
[![build](https://github.com/JulienKode/pull-request-name-linter-action/workflows/build/badge.svg)](https://github.com/JulienKode/pull-request-name-linter-action/actions)
[![GitHub issues](https://img.shields.io/github/issues/JulienKode/pull-request-name-linter-action?style=flat-square)](https://github.com/JulienKode/pull-request-name-linter-action/issues)
[![GitHub forks](https://img.shields.io/github/forks/JulienKode/pull-request-name-linter-action?style=flat-square)](https://github.com/JulienKode/pull-request-name-linter-action/network)
[![GitHub stars](https://img.shields.io/github/stars/JulienKode/pull-request-name-linter-action?style=flat-square)](https://github.com/JulienKode/pull-request-name-linter-action/stargazers)
[![GitHub license](https://img.shields.io/github/license/JulienKode/pull-request-name-linter-action?style=flat-square)](https://github.com/JulienKode/pull-request-name-linter-action/blob/master/LICENSE)
[![Watch on GitHub](https://img.shields.io/github/watchers/JulienKode/pull-request-name-linter-action.svg?style=social)](https://github.com/JulienKode/pull-request-name-linter-action/watchers)
[![Tweet](https://img.shields.io/twitter/url/https/github.com/JulienKode/pull-request-name-linter-action.svg?style=social)](https://twitter.com/intent/tweet?text=Checkout%20this%20library%20https%3A%2F%2Fgithub.com%2FJulienKode%2Fpull-request-name-linter-action)
---

**GitHub action** to automatically **lint pull request name** with [**commitlint**](https://commitlint.js.org).
This is useful if squash merge your pull request for example.

**Note**: If you are looking to lint the commits of your pull request with commitlint you can use [commitlint-github-action](https://github.com/wagoid/commitlint-github-action)

This package are using the commitlint 11 version

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
    - uses: actions/checkout@v4
    - name: Install Dependencies
      run: npm install @commitlint/config-conventional
    - uses: JulienKode/pull-request-name-linter-action@v19.0.0
```

**Note**: make sure you install your dependencies that commitlint use 

## Example 

If you want to see an example of usage you can checkout this repository: https://github.com/JulienKode/pull-request-name-linter-action-example

![image](https://user-images.githubusercontent.com/7658664/80835181-8a7cc280-8bf2-11ea-932b-7a954db6bf60.png)

