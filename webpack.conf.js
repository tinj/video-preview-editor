var path    = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: './js/imageselect.js',
    module: {
        loaders: [
            {test: /\.jade$/, loader: 'jade-loader'},
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader'}
        ],
        noParse: [
            // optimization: skip parsing vendor libs
        ]
    },
    externals: {
        'jquery': 'jQuery',
        'underscore': '_',
        'iScroll': 'iScroll'
    },
    output: {
        library: 'VideoPreviewGen',
        filename: 'videoPreviewGen.js',
        libraryTarget: 'umd',
        path: path.join(__dirname, '/build')
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     VERSION: JSON.stringify('0.3.0')
        // }),
        new webpack.optimize.DedupePlugin(),
    ],
    resolve: {
        alias: {
            // 'videojs': 'video.js/dist/video-js/video.js',
            // 'videojs-youtube': 'videojs-youtube/src/youtube.js'
        },
        root: __dirname
    }
};