const {build: esbuild} = require('esbuild')
const {execSync} = require('child_process')
const fs = require('fs')
const path = require('path')

const config = {
  entryPoints: ['lib/main.js'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  minify: true,
  sourcemap: false,
  external: [],
  mainFields: ['module', 'main'],
  conditions: ['node', 'import', 'require'],
  banner: {
    js: 'const import_meta_url = require("url").pathToFileURL(__filename).href;'
  },
  plugins: [
    {
      name: 'import-meta-url',
      setup(build) {
        build.onLoad({filter: /\.js$/}, async args => {
          const contents = await fs.promises.readFile(args.path, 'utf8')
          const transformedContents = contents.replace(
            /import\.meta\.url/g,
            'import_meta_url'
          )
          return {
            contents: transformedContents,
            loader: 'js'
          }
        })
      }
    },
    {
      name: 'copy-step',
      setup(build) {
        build.onEnd(() => {
          const schemaFile =
            'node_modules/@commitlint/config-validator/lib/commitlint.schema.json'
          if (fs.existsSync(schemaFile)) {
            try {
              execSync(`cp ${schemaFile} dist/`, {stdio: 'ignore'})
            } catch (e) {
              console.warn('Warning: Could not copy schema file:', e.message)
            }
          }
        })
      }
    }
  ]
}

module.exports = config

if (require.main === module) {
  esbuild(config).catch(() => process.exit(1))
}
