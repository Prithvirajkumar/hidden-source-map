const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Ensure source maps are enabled but hidden
      webpackConfig.devtool = "hidden-source-map";

      // Add Sentry Webpack plugin
      webpackConfig.plugins.push(
        sentryWebpackPlugin({
          org: "prithvi-0c",
          project: "react-hidden-source-map",
          authToken: process.env.SENTRY_AUTH_TOKEN,
          include: "./build/static/js",
          ignore: ["node_modules"],
          urlPrefix: "~/static/js",
          release: process.env.SENTRY_RELEASE,
        })
      );

      // Ensure TerserPlugin removes sourceMappingURL comments
      webpackConfig.optimization = webpackConfig.optimization || {};
      webpackConfig.optimization.minimizer =
        webpackConfig.optimization.minimizer || [];

      let terserPlugin = webpackConfig.optimization.minimizer.find(
        (plugin) => plugin instanceof TerserPlugin
      );

      if (terserPlugin) {
        terserPlugin.options = terserPlugin.options || {};
        terserPlugin.options.terserOptions =
          terserPlugin.options.terserOptions || {};
        terserPlugin.options.terserOptions.output =
          terserPlugin.options.terserOptions.output || {};
        terserPlugin.options.terserOptions.output.comments = false;
      } else {
        // If TerserPlugin is not found, add it with the desired configuration
        terserPlugin = new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
          extractComments: false,
        });
        webpackConfig.optimization.minimizer.push(terserPlugin);
      }

      return webpackConfig;
    },
  },
};
