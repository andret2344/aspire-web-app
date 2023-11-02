const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-source-map',
	devServer: {
		hot: true,
		open: true,
		historyApiFallback: true,
		port: 3000
	},
	plugins: [
		new ReactRefreshWebpackPlugin(),
		new Dotenv({
			path: `./.env.dev`,
			systemvars: true
		})
	]
};
