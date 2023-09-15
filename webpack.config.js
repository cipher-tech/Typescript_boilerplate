// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require("webpack-node-externals");
const NodemonPlugin = require("nodemon-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const isProduction = process.env.NODE_ENV == 'production';


const config = {
    target: "node",
    entry: './src/index.ts',
    devtool:'source-map',
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    output: {
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].js',
    },
    devServer: {
        open: true,
        host: 'localhost',
        port: process.env.PORT || 4045
    },
    plugins: [
        new NodePolyfillPlugin(),
        new NodemonPlugin(),
        new Dotenv(),
        new webpack.EnvironmentPlugin( { ...process.env } )
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
        "fallback": {
            "path": require.resolve("path-browserify")
          }
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
