import webpack from 'webpack';
import os from 'os';

const serverName = '';

export default {
    devtool: 'eval-source-map',
    entry: {
        app: [
            'eventsource-polyfill',
            'webpack-hot-middleware/client?reload=true',
            'webpack/hot/only-dev-server',
            'react-hot-loader/patch',
            './src/front/index.jsx',
        ],
        vendor: [
            'react',
            'react-dom',
        ],
    },

    output: {
        path: __dirname + '/../public',
        filename: 'app.js',
        publicPath: serverName + '/',
    },

    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            '/src/front',
            'node_modules',
        ],
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                exclude: [ /\.git/, /node_modules\/(?!(react-datepicker)\/).*/ ],
                loader: 'style-loader!css-loader?localIdentName=[name]__[local]__[hash:base64:5]&modules&importLoaders=1&sourceMap',
            }, {
                test: /\.(js|jsx)$/,
                exclude: [ /\.git/, /node_modules/, /.+\.config.js/],
                loader: 'babel-loader',
                query:
                  {
                    presets:['react']
                  }
            }, {
                test: /\.less$/,
                exclude: [ /\.git/, /node_modules/ ],
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "less-loader" // compiles Less to CSS
                    }
                ],
            }, {
                test: /\.(jpe?g|gif|png|svg)$/i,
                exclude: [ /\.git/, /node_modules/ ],
                loader: 'url-loader?limit=10000',
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                exclude: [ /\.git/, /node_modules/ ],
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                exclude: [ /\.git/, /node_modules/ ],
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                exclude: [ /\.git/, /node_modules/ ],
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                exclude: [ /\.git/, /node_modules/ ],
                loader: "file-loader"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                exclude: [ /\.git/, /node_modules/ ],
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            }, {
                test: /\.json$/,
                exclude: [ /\.git/, /node_modules/ ],
                loader: 'json-loader',
            },
        ],
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor.js',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'CLIENT': JSON.stringify(true),
                'NODE_ENV': JSON.stringify('development'),
            }
        }),
    ],
};

