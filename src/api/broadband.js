import resource from 'resource-router-middleware';
import fs from 'fs';
import _ from 'lodash';
import path from "path";
import * as BB from '../lib/broadband';

export default () => resource({

	id : 'broadband',

	index({ params }, res) {

		const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/') + 'items.json', 'utf-8'));
		const init = BB.getBroadbands(data.items);	

		let combinations  = [];

		init.map((broadband) => {
			combinations = combinations.concat(BB.getCombinations(data.items, data.connections, broadband, data.connections, [broadband.name], [broadband.type]));
		})

		const plans = _.orderBy(BB.planMount(data.items, data.connections, combinations), ['total'],['asc']);

		res.status(200).json({ plans });
	}
});
