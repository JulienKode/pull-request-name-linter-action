const {build: esbuild} = require('esbuild')
const {createRequire} = require('module')
const fs = require('fs')
const path = require('path')

const commitlintRequire = createRequire(require.resolve('@commitlint/load'))

function copyTemplates() {
  const templatesDir = 'dist/templates'
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, {recursive: true})
  }

  try {
    const angularDir = path.dirname(
      commitlintRequire.resolve('conventional-changelog-angular')
    )
    const templateSrc = path.join(angularDir, 'templates')
    if (fs.existsSync(templateSrc)) {
      for (const file of fs.readdirSync(templateSrc)) {
        if (file.endsWith('.hbs')) {
          fs.copyFileSync(
            path.join(templateSrc, file),
            path.join(templatesDir, file)
          )
        }
      }
    }
  } catch (e) {
    console.warn('Warning: Could not copy template files:', e.message)
  }
}

function copySchema() {
  try {
    const schemaFile = commitlintRequire.resolve(
      '@commitlint/config-validator/lib/commitlint.schema.json'
    )
    fs.copyFileSync(schemaFile, path.join('dist', 'commitlint.schema.json'))
  } catch (e) {
    console.warn('Warning: Could not copy schema file:', e.message)
  }
}

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
      name: 'copy-assets',
      setup(build) {
        build.onEnd(() => {
          copyTemplates()
          copySchema()
        })
      }
    }
  ]
}

module.exports = config

if (require.main === module) {
  esbuild(config).catch(() => process.exit(1))
}
