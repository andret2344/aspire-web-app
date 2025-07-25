const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: path.resolve(__dirname, '..', './src/main/index.tsx'),
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		alias: {
			'@components': path.resolve(
				__dirname,
				'..',
				'./src/main/Components'
			),
			'@entity': path.resolve(__dirname, '..', './src/main/Entity'),
			'@hooks': path.resolve(__dirname, '..', './src/main/Hooks'),
			'@services': path.resolve(__dirname, '..', './src/main/Services'),
			'@layouts': path.resolve(__dirname, '..', './src/main/Layouts'),
			'@pages': path.resolve(__dirname, '..', './src/main/Pages'),
			'@types': path.resolve(__dirname, '..', './src/main/Types'),
			'@utils': path.resolve(__dirname, '..', './src/main/Utils')
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
		})
	],
	stats: 'errors-only'
};
