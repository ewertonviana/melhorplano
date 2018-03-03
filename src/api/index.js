import { version } from '../../package.json';
import { Router } from 'express';
import broadband from './broadband';

export default () => {
	let api = Router();

	api.use('/list-all-broadband', broadband());

	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
