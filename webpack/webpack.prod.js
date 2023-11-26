const webpack = require('webpack');
module.exports = {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				REACT_APP_API: JSON.stringify('http://localhost:8083')
			}
		})
	]
};
