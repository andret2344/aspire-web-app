const webpack = require('webpack');

module.exports = {
	mode: 'production',
	plugins: [
		new webpack.DefinePlugin({
			'process.env.REACT_API_URL': JSON.stringify(process.env.REACT_API_URL || ''),
		})
	]
};
