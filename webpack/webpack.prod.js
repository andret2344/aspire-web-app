const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'production',
	plugins: [
		new Dotenv({path: '.env', systemvars: true}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.REACT_APP_API_TOKEN': JSON.stringify(process.env.REACT_APP_API_TOKEN ?? ''),
		}),
	],
};
