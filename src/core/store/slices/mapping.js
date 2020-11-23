import { createSlice } from '@reduxjs/toolkit';
import { db as dexiedb } from '../../indexeddb/dexiedb';

import { setFeatureCollection } from './featureCollection';
import { initIndex } from './spatialIndex';

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
		setBoundingBox: (state, action) => {
			state.boundingBox = action.payload;
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
//export slice
export default mappingSlice;

//actions
export const { setBoundingBox, setDone, setFilter } = mappingSlice.actions;

//selectors
export const getBoundingBox = (state) => state.mapping.boundingBox;
export const isDone = (state) => state.mapping.done;
export const getFilter = (state) => state.mapping.filter;

//complex actions
export const setBoundingBoxAndLoadObjects = (bb) => async (dispatch, getState) => {
	dispatch(setDone(false));

	setTimeout(() => {
		dispatch(setBoundingBox(bb));
	}, 1);

	const state = getState();
	if (state.spatialIndex.loading === 'done') {
		let resultIds = state.spatialIndex.pointIndex.range(bb.left, bb.bottom, bb.right, bb.top);

		let leitungsFeatures = [];

		if (state.mapping.filter.leitung.enabled === true) {
			leitungsFeatures = state.spatialIndex.lineIndex
				.search(bb.left, bb.bottom, bb.right, bb.top)
				.map((i) => state.spatialIndex.lineIndex.features[i]);
		}
		// console.log('leitungsFeatures', leitungsFeatures);

		getFeaturesForHits(
			state.spatialIndex.pointIndex.points,
			resultIds,
			state.mapping.filter
		).then((pointFeatureCollection) => {
			const featureCollection = leitungsFeatures.concat(pointFeatureCollection);
			dispatch(setFeatureCollection(featureCollection));
			setTimeout(() => {
				dispatch(setDone(true));
			}, 1);
		});
	} else {
		dispatch(
			initIndex(() => {
				dispatch(setBoundingBoxAndLoadObjects(bb));
				setTimeout(() => {}, 500);
			})
		);
	}
};

const getFeaturesForHits = async (points, resultIds, filter) => {
	const featureCollection = [];

	const tablenames = new Set();
	for (const id of resultIds) {
		const hit = points[id];
		tablenames.add(hit.tablename);

		if ((filter[hit.tablename] || {}).enabled === true) {
			const feature = await createFeatureFromHit(hit);
			featureCollection.push(feature);
		}
	}

	return featureCollection;
};

const createFeatureFromHit = async (hit) => {
	const feature = {
		text: '-',
		type: 'Feature',
		featuretype: hit.tablename,
		geometry: {
			type: 'Point',
			coordinates: [ hit.x, hit.y ]
		},
		crs: {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::25832'
			}
		},
		properties: {}
	};

	// const db = await dbPromise;
	// feature.properties = await db.get(hit.tablename, hit.id);
	feature.properties = dexiedb[hit.tablename].get(hit.id);
	return feature;
};
