/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');

let entryFile = '';
if (fs.existsSync('./src/index.tsx')) {
    entryFile = './src/index.tsx';
} else {
    entryFile = './src/index.ts';
}

module.exports = {
    entry: resolve(entryFile),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                },
            },
            {
                test: /\.css$/,
                //    use: ['style-loader', 'css-loader']
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },

            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            // 解析url
            {
                test: /\.(svg|woff|woff2|jpg|png|ttf|eot)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[hash].[ext]',
                        limit: 1024,
                    },
                },
            },
            {
                test: /\.(pmx|vmd|gltf|fbx)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]', // 指定输出的路径和文件名格式
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new WebpackBarPlugin(),
        // new ForkTsCheckerWebpackPlugin({
        //     tsconfig: resolve(__dirname, '../tsconfig.json'),
        //     // eslint: true,
        //     async: tsCheckerAsync,
        // }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './index.html'),
            // favicon: resolve(__dirname, './favicon.ico'),
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    devServer: {
        host: 'localhost',
        compress: true,
        static: {
            directory: resolve(__dirname, '../'),
        },
        // stats: {
        //     assets: false,
        //     builtAt: true,
        //     modules: false,
        //     entrypoints: false,
        //     /**
        //      * ts-node transpileOnly: true
        //      * if you enable this option, webpack 4 will give you "export not found" warnings any time you re-export a type:
        //      * The reason this happens is that when typescript doesn't do a full type check,
        //      * it does not have enough information to determine whether an imported name is a type or not,
        //      * so when the name is then exported, typescript has no choice but to emit the export.
        //      * Fortunately, the extraneous export should not be harmful, so you can just suppress these warnings:
        //      */
        //     warningsFilter: /export .* was not found in/,
        // },
        port: 8000,
    },
};
