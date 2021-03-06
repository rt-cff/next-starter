/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');
const withPurgeCss = require('next-purgecss');
const withSASS = require('@zeit/next-sass');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withPWA = require('next-pwa');
const Dotenv = require('dotenv-webpack');
const path = require('path');
/* eslint-enable @typescript-eslint/no-var-requires */

if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => {};
}

const nextConfig = {
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60,
    pagesBufferLength: 5,
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
  typescript: {
    ignoreDevErrors: true,
    ignoreBuildErrors: true,
  },
  pwa: {
    dest: 'public',
  },
  webpack: config => {
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true,
      }),
    );

    return config;
  },
};

const plugins = [[withLess], [withBundleAnalyzer], [withSASS]];

if (process.env.NODE_ENV !== 'development') {
  plugins.push([withPWA], [withCSS, withPurgeCss]);
} else {
  plugins.push([withCSS]);
}

module.exports = withPlugins(plugins, nextConfig);
