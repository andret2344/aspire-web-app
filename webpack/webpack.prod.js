const webpack = require('webpack');

module.exports = {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({
				NODE_ENV: 'production',
				REACT_APP_API_TOKEN: process.env.REACT_APP_API_TOKEN ?? '',
			}),
		}),
	],
};
