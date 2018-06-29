# Webpack cleanup after build plugin

This plugin is a Webpack 4 plugin that cleans up extraneous files from the output
directory. This is useful when running new builds or in watch mode, where new files
are created all the time, but you don't necessarily want all these old files to
stick around.

The plugin runs at the end of the build (after Webpack finishes emitting files),
and removes files in the output folder that were not part of the completed compilation.

## Usage

Just import the plugin and add it to your Webpack configuration.

```js
import { WebpackCleanupAfterBuildPlugin } from 'webpack-cleanup-after-build-plugin'

export default {
  plugins: [
    new WebpackCleanupAfterBuildPlugin(options)
  ]
}
```

## Options

You can optionally pass an options object to the plugin's constructor.

| Option name    | Default | Description |
| -------------- | ------- | ----------- |
| filesToKeep    | []      | A list of files to never delete. Relative paths are assumed to be relative to the output path. |
| ignoreDotFiles | true    | Whether to ignore files and directories starting with a dot (".") |

Example:

```js
new WebpackCleanupAfterBuildPlugin({
  filesToKeep: [
    '.mydotfile',
    'not-generated-by-webpack.js'
  ],
  ignoreDotFiles: false
})
```
