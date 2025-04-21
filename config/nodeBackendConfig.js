const { cloneDeep } = require("lodash");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const LoadablePlugin = require("@loadable/webpack-plugin");
const paths = require("./paths");

const configErrorMsg =
  "create-react-app config structure changed, please check webpack.config.js and update to use the changed config";

const checkCorrectWebpackConfig = (config) => {
  if (!config) {
    throw new Error(configErrorMsg);
  }
  const hasTarget = config.target;

  const hasRules =
    config.module && config.module.rules && config.module.rules.length === 2;

  const hasOneOf =
    hasRules &&
    config.module.rules[1].oneOf &&
    config.module.rules[1].oneOf.length === 10;

  // check if webpack config has css loader or not
  const hasCssLoader =
    hasOneOf &&
    config.module.rules[1].oneOf[5].test &&
    config.module.rules[1].oneOf[5].test.test("file.css");

  const hasOutput =
    config.output &&
    typeof config.output === "object" &&
    config.output.constructor === Object;

  const hasOptimization = !!config.optimization;

  const hasPlugins = config.plugins && Array.isArray(config.plugins);

  const hasAllRequiredValues =
    hasTarget &&
    hasOutput &&
    hasRules &&
    hasCssLoader &&
    hasPlugins &&
    hasOptimization;

  if (!hasAllRequiredValues) {
    throw new Error(configErrorMsg);
  }
};

const applyNodeConfigurations = (
  config,
  target,
  isEnvProduction,
  extraOptions = {}
) => {
  const isNodeTarget = target === "node";
  checkCorrectWebpackConfig(config);
  const newConfig = cloneDeep(config);

  newConfig.plugins = [new LoadablePlugin(), ...newConfig.plugins];

  if (isNodeTarget) {
    newConfig.name = "node";
    newConfig.target = "node";

    // Not include @loadable/component and node_modules in build as it will be available outside the build folder.
    newConfig.externals = ["@loadable/component", nodeExternals()];

    // add node build path for only server build
    newConfig.output.path = isEnvProduction
      ? path.join(paths.appBuild, "node")
      : undefined;

    // Set build output specifically for node
    newConfig.output.libraryTarget = "commonjs2";
    newConfig.output.filename = "[name].[contenthash:8].js";
    newConfig.output.chunkFilename = function (pathData, assetInfo) {
      if (pathData.chunk.name === "main" || !pathData.chunk.name) {
        return "[name].[contenthash:8].chunk.js";
      }
      let namesArr = pathData.chunk.name.replace("pages-", "").split("-");
      if (namesArr.length < 1) {
        return "[name].[contenthash:8].chunk.js";
      }
      pathData.chunk.name = namesArr[0];
      return "[name].[contenthash:8].chunk.js";
    };

    // Disable runtimeChunk as it seems to break the server build
    // Runtime chunk is necessary logic for managing module loading, dependency resolution, and other runtime-related tasks.
    // By default, the Webpack runtime code is included in the main bundle.
    // However, in certain scenarios, it might extract  the runtime code into a separate chunk.
    newConfig.optimization.runtimeChunk = undefined;
  }

  return newConfig;
};

module.exports = {
  applyNodeConfigurations,
};
