import { createSlice } from '@reduxjs/toolkit';
import dexieworker from 'workerize-loader!../../workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax
import { initIndex } from './spatialIndex';
import { db as dexiedb } from '../../indexeddb/dexiedb';

//---------

const dexieW = dexieworker();
const focusedSearchMinimumZoomThreshhold = 12.5;
const searchMinimumZoomThreshhold = 13.5;

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

const featureCollectionSlice = createSlice({
	name: 'featureCollection',
	initialState: {
		features: [],
		done: true,
		filter: initialFilter
	},
	reducers: {
		setFeatureCollection: (state, action) => {
			state.features = action.payload;
		},
		setDone: (state, action) => {
			state.done = action.payload;
		},
		setFilter: (state, action) => {
			state.filter = action.payload;
			localStorage.setItem(FILTER_KEY, JSON.stringify(action.payload));
		}
	}
});
export const { setFeatureCollection, setDone, setFilter } = featureCollectionSlice.actions;

export const getFeatureCollection = (state) => state.featureCollection.features;
export const isDone = (state) => state.featureCollection.done;
export const getFilter = (state) => state.featureCollection.filter;
export default featureCollectionSlice;

export const loadObjectsIntoFeatureCollection = ({ boundingBox }) => {
	return async (dispatch, getState) => {
		//console.log('xxx setBoundingBoxAndLoadObjects');
		setTimeout(() => {
			dispatch(setDone(false));
		}, 1);

		(async () => {
			await timeout(10);
			let d = new Date().getTime();

			const state = getState();
			const filter = getFilter(state);
			//console.log('xxx nach getState()');

			if (state.spatialIndex.loading === 'done') {
				let resultIds = state.spatialIndex.pointIndex.range(
					boundingBox.left,
					boundingBox.bottom,
					boundingBox.right,
					boundingBox.top
				);

				//console.log('xxx alle resultIds da ', new Date().getTime() - d);

				let leitungsFeatures = [];

				if (filter.leitung.enabled === true) {
					const ld = new Date().getTime();
					leitungsFeatures = state.spatialIndex.lineIndex
						.search(
							boundingBox.left,
							boundingBox.bottom,
							boundingBox.right,
							boundingBox.top
						)
						.map((i) => state.spatialIndex.lineIndex.features[i]);
					//console.log('xxx Leitungen ', new Date().getTime() - ld);
				}
				// console.log('leitungsFeatures', leitungsFeatures);

				d = new Date().getTime();

				dexieW
					.getFeaturesForHits(state.spatialIndex.pointIndex.points, resultIds, filter)
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
						}, 1);
					});
			} else {
				dispatch(
					initIndex(() => {
						dispatch(loadObjectsIntoFeatureCollection({ boundingBox }));
					})
				);
			}
		})();
	};
};

// const isSearchForbidden = (overrides = {}) => {
// 	let zoom = overrides.zoom || getZoom();
// 	let ifm; //= overrides.inFocusMode || inFocusMode;
// 	if (overrides.inFocusMode !== undefined) {
// 		ifm = overrides.inFocusMode;
// 	} else {
// 		ifm = inFocusMode;
// 	}
// 	return (
// 		(ifm === true && zoom < focusedSearchMinimumZoomThreshhold) ||
// 		(ifm === false && zoom < searchMinimumZoomThreshhold)
// 	);
// };

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
