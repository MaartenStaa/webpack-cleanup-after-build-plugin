import fs from 'fs'
import path from 'path'
import { compilation, Compiler, Plugin } from 'webpack'

export interface WebpackCleanupAfterBuildOptions {
  filesToKeep: string[]
  ignoreDotFiles: boolean
}

export class WebpackCleanupAfterBuild extends Plugin {
  /**
   * The options for this plugin.
   */
  private options: WebpackCleanupAfterBuildOptions

  /**
   * Constructor.
   *
   * @param options Plugin options, optional.
   */
  constructor (options?: Partial<WebpackCleanupAfterBuildOptions>) {
    super()

    this.options = { filesToKeep: [], ignoreDotFiles: true, ...options }
  }

  /**
   * Hook into the Webpack build process.
   *
   * @param compiler The Webpack compiler.
   */
  apply (compiler: Compiler): void {
    compiler.hooks.afterEmit.tap('webpack-cleanup-after-build', this.cleanupFiles)
  }

  /**
   * Called after a build, clean up all files in the output path which were not
   * the result of the given compilation.
   */
  cleanupFiles = (compilation: compilation.Compilation): void => {
    const outputPath = compilation.outputOptions.path
    const assetList = Object.keys(compilation.assets)
      .map((filename: string): string => path.join(outputPath, filename))
      .concat(this.options.filesToKeep.map(fileToKeep =>
        path.isAbsolute(fileToKeep) ? fileToKeep : path.join(outputPath, fileToKeep)
      ))

    // Now we just walk the tree from the output path, and remove the files not
    // in the asset list.
    this.cleanupDirectory(outputPath, assetList)
  }

  /**
   * Clean up extraneous files from the given directory.
   *
   * @param directory The directory to scan.
   * @param assetList The whitelist of files (absolute paths) to keep.
   */
  cleanupDirectory (directory: string, assetList: string[]): void {
    fs.readdirSync(directory)
      .map(entry => {
        // Ignore dotfiles.
        if (this.options.ignoreDotFiles && entry.startsWith('.')) {
          return
        }

        // Recurse if it's a directory.
        const absolute = path.join(directory, entry)
        if (fs.statSync(absolute).isDirectory()) {
          this.cleanupDirectory(absolute, assetList)
        } else if (assetList.indexOf(absolute) < 0) {
          // This file is not in the asset list and should be removed.
          fs.unlinkSync(absolute)
        }
      })

    // If the directory is empty now, delete that also.
    if (fs.readdirSync(directory).length === 0) {
      fs.rmdirSync(directory)
    }
  }
}
