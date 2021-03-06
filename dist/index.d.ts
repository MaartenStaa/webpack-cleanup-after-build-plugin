import { compilation, Compiler, Plugin } from 'webpack';
export interface WebpackCleanupAfterBuildPluginOptions {
    /**
     * A list of files to never delete. If the paths are relative, they are assumed
     * to be relative to Webpack's output path.
     */
    filesToKeep: string[];
    /**
     * Whether to ignore dotfiles (files, or directories, whose name starts with a
     * "."). Defaults to true.
     */
    ignoreDotFiles: boolean;
}
export declare type WebpackCleanupAfterBuildPluginInputOptions = Pick<WebpackCleanupAfterBuildPluginOptions, 'ignoreDotFiles'> | Pick<WebpackCleanupAfterBuildPluginOptions, 'filesToKeep'> | Pick<WebpackCleanupAfterBuildPluginOptions, 'ignoreDotFiles' | 'filesToKeep'>;
export declare class WebpackCleanupAfterBuildPlugin implements Plugin {
    /**
     * The options for this plugin.
     */
    private options;
    /**
     * Constructor.
     *
     * @param options Plugin options, optional.
     */
    constructor(options?: WebpackCleanupAfterBuildPluginInputOptions);
    /**
     * Hook into the Webpack build process.
     *
     * @param compiler The Webpack compiler.
     */
    apply(compiler: Compiler): void;
    /**
     * Called after a build, clean up all files in the output path which were not
     * the result of the given compilation.
     */
    cleanupFiles: (compilation: compilation.Compilation) => void;
    /**
     * Clean up extraneous files from the given directory.
     *
     * @param directory The directory to scan.
     * @param assetList The whitelist of files (absolute paths) to keep.
     */
    cleanupDirectory(directory: string, assetList: string[]): void;
}
