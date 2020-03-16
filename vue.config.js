const webpack = require("webpack");

const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const appVersion = JSON.parse(packageJson).version || 0;

const manifestJson = fs.readFileSync("./public/manifest.json");
const appName = JSON.parse(manifestJson).name || "Unnamed";

module.exports = {
  configureWebpack: () => {
    return {
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
    progress: false
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
