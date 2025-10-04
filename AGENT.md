# AGENT.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

This is a GitHub Action that validates pull request titles against commitlint rules. It uses `@commitlint/load` to load configurations and `@commitlint/lint` to validate PR titles.

## Core Architecture

- **src/main.ts**: Entry point that retrieves PR title from GitHub context and calls the linter
- **src/linter.ts**: Core logic that loads commitlint config and validates titles
  - `lintPullRequest()`: Main validation function that loads config, parses rules, and returns validation results
  - `getLintOptions()`: Extracts parser options, plugins, and ignores from commitlint config
  - `selectParserOpts()`: Safely extracts parser options from parser presets

The action reads PR title from `github.context.payload.pull_request.title` and validates it against a commitlint configuration file (default: `./commitlint.config.js`).

## Development Commands

```bash
# Build TypeScript to lib/
yarn build

# Bundle with esbuild to dist/index.js
yarn bundle

# Run tests
yarn test

# Run tests for a specific file
yarn test linter.test

# Lint code
yarn lint

# Format code
yarn format

# Check formatting
yarn format-check

# Full build, test, and bundle pipeline
yarn all

# Build and bundle together
yarn build:pack
```

## Build Process

The project uses a two-step build:
1. **TypeScript compilation**: `tsc` compiles `src/**/*.ts` to `lib/` (CommonJS)
2. **esbuild bundling**: Bundles `lib/main.js` to single `dist/index.js` file

**Important esbuild behavior** (see esbuild.config.js):
- Replaces `import.meta.url` with `import_meta_url` for Node.js compatibility
- Copies template files from `conventional-changelog-angular/templates` to `dist/templates/`
- Copies `commitlint.schema.json` to `dist/` for config validation
- Target: Node.js 20, CommonJS format

## Testing

Tests use Jest with mocked `@commitlint/load` and `@commitlint/lint` modules (see jest.config.js and test/__mocks__/). When adding tests:
- Mocks are in `test/__mocks__/commitlint-{load,lint}.js`
- Test files match `**/*.test.ts`
- Tests validate both valid and invalid PR title formats

## Configuration

The action accepts one input parameter:
- `configuration-path`: Path to commitlint config (default: `./commitlint.config.js`)

Example commitlint config format (commitlint.config.js):
```javascript
module.exports = { 
  rules: { 
    "scope-case": [2, "always", "lower-case"] 
  } 
}
```

## Key Dependencies

- `@commitlint/load`: Loads commitlint configurations with plugin support
- `@commitlint/lint`: Validates commit messages against rules
- Custom resolution for `import-fresh` to handle missing parent module issue
