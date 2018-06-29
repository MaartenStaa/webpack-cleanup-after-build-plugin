"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var WebpackCleanupAfterBuildPlugin = /** @class */ (function () {
    /**
     * Constructor.
     *
     * @param options Plugin options, optional.
     */
    function WebpackCleanupAfterBuildPlugin(options) {
        var _this = this;
        /**
         * Called after a build, clean up all files in the output path which were not
         * the result of the given compilation.
         */
        this.cleanupFiles = function (compilation) {
            var outputPath = compilation.outputOptions.path;
            var assetList = Object.keys(compilation.assets)
                .map(function (filename) { return path_1.default.join(outputPath, filename); })
                .concat(_this.options.filesToKeep.map(function (fileToKeep) {
                return path_1.default.isAbsolute(fileToKeep) ? fileToKeep : path_1.default.join(outputPath, fileToKeep);
            }));
            // Now we just walk the tree from the output path, and remove the files not
            // in the asset list.
            _this.cleanupDirectory(outputPath, assetList);
        };
        this.options = __assign({ filesToKeep: [], ignoreDotFiles: true }, options);
    }
    /**
     * Hook into the Webpack build process.
     *
     * @param compiler The Webpack compiler.
     */
    WebpackCleanupAfterBuildPlugin.prototype.apply = function (compiler) {
        compiler.hooks.afterEmit.tap('webpack-cleanup-after-build', this.cleanupFiles);
    };
    /**
     * Clean up extraneous files from the given directory.
     *
     * @param directory The directory to scan.
     * @param assetList The whitelist of files (absolute paths) to keep.
     */
    WebpackCleanupAfterBuildPlugin.prototype.cleanupDirectory = function (directory, assetList) {
        var _this = this;
        fs_1.default.readdirSync(directory)
            .map(function (entry) {
            // Ignore dotfiles.
            if (_this.options.ignoreDotFiles && entry.startsWith('.')) {
                return;
            }
            // Recurse if it's a directory.
            var absolute = path_1.default.join(directory, entry);
            if (fs_1.default.statSync(absolute).isDirectory()) {
                _this.cleanupDirectory(absolute, assetList);
            }
            else if (assetList.indexOf(absolute) < 0) {
                // This file is not in the asset list and should be removed.
                fs_1.default.unlinkSync(absolute);
            }
        });
        // If the directory is empty now, delete that also.
        if (fs_1.default.readdirSync(directory).length === 0) {
            fs_1.default.rmdirSync(directory);
        }
    };
    return WebpackCleanupAfterBuildPlugin;
}());
exports.WebpackCleanupAfterBuildPlugin = WebpackCleanupAfterBuildPlugin;
