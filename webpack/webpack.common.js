const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: path.resolve(__dirname, '..', './src/main/index.tsx'),
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@component': path.resolve(__dirname, '..', './src/main/Component'),
			'@context': path.resolve(__dirname, '..', './src/main/Context'),
			'@entity': path.resolve(__dirname, '..', './src/main/Entity'),
			'@hook': path.resolve(__dirname, '..', './src/main/Hook'),
			'@service': path.resolve(__dirname, '..', './src/main/Service'),
			'@layout': path.resolve(__dirname, '..', './src/main/Layout'),
			'@page': path.resolve(__dirname, '..', './src/main/Page'),
			'@type': path.resolve(__dirname, '..', './src/main/Type'),
			'@util': path.resolve(__dirname, '..', './src/main/Util')
		}
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: 'asset/inline'
			}
		]
	},
	output: {
		path: path.resolve(__dirname, '..', './build'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '..', './src/main/index.html')
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser.js'
		}),
		new Dotenv({
			path: `./.env.local`,
			systemvars: true
		})
	],
	stats: 'errors-only'
};
