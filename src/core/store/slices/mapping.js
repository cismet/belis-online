import { createSlice } from '@reduxjs/toolkit';
import { db as dexiedb } from '../../indexeddb/dexiedb';

import { setFeatureCollection } from './featureCollection';
import { initIndex } from './spatialIndex';

import dexieworker from 'workerize-loader!../../workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax
const dexieW = dexieworker();

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const FILTER_KEY = '@belis.app.filter';
const initialFilter = JSON.parse(
	localStorage.getItem(FILTER_KEY) ||
		JSON.stringify({
			tdta_leuchten: { title: 'Leuchten', enabled: true },
			tdta_standort_mast: { title: 'Masten (ohne Leuchten)', enabled: true },
			mauerlasche: { title: 'Mauerlaschen', enabled: true },
			leitung: { title: 'Leitungen', enabled: false },
			schaltstelle: { title: 'Schaltstellen', enabled: true },
			abzweigdose: { title: 'Abzweigdosen', enabled: true }
		})
);

const mappingSlice = createSlice({
	name: 'mapping',
	initialState: {
		boundingBox: undefined,
		mode: 'offline',
		done: false,
		filter: initialFilter
	},
	reducers: {
		setDone: (state, action) => {
			state.done = action.payload;
		},
		setFilter: (state, action) => {
			state.filter = action.payload;
			localStorage.setItem(FILTER_KEY, JSON.stringify(action.payload));
		}
	}
});
//export slice
export default mappingSlice;

//actions
export const { setDone, setFilter } = mappingSlice.actions;

//selectors
export const getBoundingBox = (state) => state.mapping.boundingBox;
export const isDone = (state) => state.mapping.done;
export const getFilter = (state) => state.mapping.filter;

//complex actions
export const setBoundingBoxAndLoadObjects = (bb) => async (dispatch, getState) => {
	//console.log('xxx setBoundingBoxAndLoadObjects');
	setTimeout(() => {
		dispatch(setDone(false));
	}, 1);

	(async () => {
		await timeout(100);
		let d = new Date().getTime();

		const state = getState();
		//console.log('xxx nach getState()');

		if (state.spatialIndex.loading === 'done') {
			let resultIds = state.spatialIndex.pointIndex.range(
				bb.left,
				bb.bottom,
				bb.right,
				bb.top
			);

			//console.log('xxx alle resultIds da ', new Date().getTime() - d);

			let leitungsFeatures = [];

			if (state.mapping.filter.leitung.enabled === true) {
				const ld = new Date().getTime();
				leitungsFeatures = state.spatialIndex.lineIndex
					.search(bb.left, bb.bottom, bb.right, bb.top)
					.map((i) => state.spatialIndex.lineIndex.features[i]);
				//console.log('xxx Leitungen ', new Date().getTime() - ld);
			}
			// console.log('leitungsFeatures', leitungsFeatures);

			d = new Date().getTime();

			dexieW
				.getFeaturesForHits(
					state.spatialIndex.pointIndex.points,
					resultIds,
					state.mapping.filter
				)
				.then((pointFeatureCollection) => {
					//console.log('xxx alle Features da ', new Date().getTime() - d);
					const featureCollection = leitungsFeatures.concat(pointFeatureCollection);
					//console.log('xxx alle Features da nach concat ', new Date().getTime() - d);

					d = new Date().getTime();
					//console.log('xxx vor setFeatureCollection');
					dispatch(setFeatureCollection(featureCollection));
					//setFC(featureCollection);
					//console.log('xxx nach  setFeatureCollection', new Date().getTime() - d);

					//console.log('xxx', '(done = true)');
					// dispatch(setDone(true));
					setTimeout(() => {
						dispatch(setDone(true));
					}, 25);
				});
		} else {
			dispatch(
				initIndex(() => {
					dispatch(setBoundingBoxAndLoadObjects(bb));
				})
			);
		}
	})();
};
