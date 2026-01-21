const webpack = require('webpack');

module.exports = {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.REACT_APP_API_TOKEN': JSON.stringify(process.env.REACT_APP_API_TOKEN ?? ''),
			'process.env.REACT_API_URL': 'undefined',
		}),
	],
};
