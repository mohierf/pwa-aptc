const webpack = require("webpack");

const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const appVersion = JSON.parse(packageJson).version || 0;

const manifestJson = fs.readFileSync("./public/manifest.json");
const appName = JSON.parse(manifestJson).name || "Unnamed";

module.exports = {
  // chainWebpack: config => config.optimization.minimize(false),
  configureWebpack: () => {
    return {
      // optimization: false,
      plugins: [
        new webpack.DefinePlugin({
          "process.env": {
            APP_VERSION: JSON.stringify(appVersion),
            APP_NAME: JSON.stringify(appName)
          }
        })
      ]
    };
  },
  // remove vue-cli-service's progress output
  devServer: {
    progress: false,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    },
    moment: {
      locales: ["en", "fr"]
    }
  }
};
