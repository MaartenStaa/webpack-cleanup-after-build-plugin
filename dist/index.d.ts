import { compilation, Compiler, Plugin } from 'webpack';
export declare class WebpackCleanupAfterBuild extends Plugin {
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
