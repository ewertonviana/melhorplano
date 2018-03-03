import http from 'http';
import express from 'express';
import morgan from 'morgan';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack';
import fs from 'fs';
import path from 'path';

const compiler = webpack(webpackConfig);
const app = express();

app.server = http.createServer(app);

app.use(morgan('dev'));

app.use(middleware());

app.use('/api', api());

app.use('/', express.static('src/public/app'));

app.use(webpackDevMiddleware(compiler, { 
	noInfo: false, 
	publicPath: webpackConfig.output.publicPath,
	hot: true,
	disableHostCheck: true,
	stats: {
		colors: true,
		hash: false,
		timings: true,
		chunks: false,
		chunkModules: false,
		modules: false
	}
}));

app.use(webpackHotMiddleware(compiler));

app.use(express.static(path.join(__dirname, 'src/public/')));

app.get('*', function response(req, res) {
	res.set('Content-Type', 'text/html');
	res.write(fs.readFileSync(path.join(__dirname, 'public/index.html'), { encoding: 'utf-8' }).replace(
		'<script src="https://apis.google.com/js/api.js"></script>', 
		'<script src="https://apis.google.com/js/api.js">' +
		'<script src="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap/<version>/react-bootstrap.min.js">' +
		'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">' +
		'</script><script src="/vendor.js">' +
		'</script><script src="/app.js"></script>'
		));

	res.end();
});

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
