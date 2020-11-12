import { createSlice } from '@reduxjs/toolkit';
import { dbPromise } from '../../indexeddb/db';
import { setFeatureCollection } from './featureCollection';
import { initIndex } from './spatialIndex';

const mappingSlice = createSlice({
	name: 'mapping',
	initialState: {
		boundingBox: undefined,
		mode: 'offline'
	},
	reducers: {
		setBoundingBox: (state, action) => {
			state.boundingBox = action.payload;
		}
	}
});
//export slice
export default mappingSlice;

//actions
export const { setBoundingBox } = mappingSlice.actions;

//selectors
export const getBoundingBox = (state) => state.mapping.boundingBox;

//complex actions
export const setBoundingBoxAndLoadObjects = (bb) => async (dispatch, getState) => {
	dispatch(setBoundingBox(bb));
	const state = getState();
	if (state.spatialIndex.loading !== undefined) {
		let resultIds = state.spatialIndex.index.range(bb.left, bb.bottom, bb.right, bb.top);

		getFeaturesForHits(state.spatialIndex.index.points, resultIds).then((featureCollection) => {
			dispatch(setFeatureCollection(featureCollection));
		});
	} else {
		dispatch(initIndex());
	}
};

const getFeaturesForHits = async (points, resultIds) => {
	const featureCollection = [];
	for (const id of resultIds) {
		const hit = points[id];
		const feature = await createFeatureFromHit(hit);
		featureCollection.push(feature);
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

	const db = await dbPromise;
	feature.properties = await db.get(hit.tablename, hit.id);
	return feature;
};
