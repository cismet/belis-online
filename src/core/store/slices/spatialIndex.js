import { createSlice } from '@reduxjs/toolkit';
import { dbPromise } from '../../indexeddb/db';
import kdbush from 'kdbush';
import Flatbush from 'flatbush';
import bbox from '@turf/bbox';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';

// import idbworker from 'workerize-loader!../../workers/idb'; // eslint-disable-line import/no-webpack-loader-syntax
import dexieworker from 'workerize-loader!../../workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax

import { db as dexiedb } from '../../workers/dexiedb';

// const idb = idbworker();
// idb.init();

const dexieW = dexieworker();

const spatialIndexSlice = createSlice({
	name: 'spatialIndex',
	initialState: {
		loading: undefined,
		pointIndex: undefined,
		lineIndex: undefined
	},
	reducers: {
		startLoading(state, action) {
			if (state.loading === undefined) {
				state.loading = 'started';
			}
		},
		initialize(state, action) {
			state.loading = 'done';
			state.pointIndex = action.payload.pointIndex;
			state.lineIndex = action.payload.lineIndex;
		}
	}
});

export default spatialIndexSlice;

export const { startLoading, initialize } = spatialIndexSlice.actions;

export const getPointIndex = (state) => state.spatialIndex.pointIndex;
export const getLoadingState = (state) => state.spatialIndex.loading;

export const initIndex = (finished = () => {}) => async (dispatch) => {
	dispatch(startLoading());
	const db = await dbPromise;
	const current = new Date().getTime();

	const getEntityNameForRawEntry = (entry) => entry.tablename;
	let pointItems, leitungen;
	// const option = 'idb';
	// const option="noworker"
	// const option = 'dexie';
	const option = 'directdexie';

	if (option === 'idb') {
		// await idb.init();
		// pointItems = await idb.getAll('raw_point_index');
		// leitungen = await idb.getAll('leitung');
	} else if (option === 'noworker') {
		pointItems = await db.getAll('raw_point_index');
		leitungen = await db.getAll('leitung');
	} else if (option === 'dexie') {
		//dexie
		pointItems = await dexieW.getAll('raw_point_index');
		leitungen = await dexieW.getAll('leitung');
	} else if (option === 'directdexie') {
		//dexie
		pointItems = await dexiedb['raw_point_index'].toArray();
		leitungen = await dexiedb['leitung'].toArray();
	}

	const coordinatesResolver = (o) => {
		try {
			return [ o.x, o.y ];
		} catch (e) {
			console.log('probblem in ', o);
			return [ -1, -1 ];
		}
	};

	const pointIndex = new kdbush(
		pointItems,
		(p) => coordinatesResolver(p)[0],
		(p) => coordinatesResolver(p)[1]
	);

	console.log(
		'Spatial PointIndex mit ' +
			pointItems.length +
			' Objekten in ' +
			(new Date().getTime() - current) +
			' ms angelegt.'
	);

	const currentL = new Date().getTime();
	const features = [];
	for (const l of leitungen) {
		try {
			const feature = {
				text: '-',
				type: 'Feature',
				featuretype: 'Leitung',
				crs: {
					type: 'name',
					properties: {
						name: 'urn:ogc:def:crs:EPSG::25832'
					}
				},
				properties: {}
			};
			feature.geometry = {
				type: 'LineString',
				coordinates: l.geom.geo_field.coordinates
			};

			features.push(feature);
		} catch (e) {
			//console.log('problem with ', l);
		}
	}
	let lineIndex;
	if (features.length > 0) {
		lineIndex = new Flatbush(features.length);

		for (const f of features) {
			const bb = bbox(f);

			lineIndex.add(bb[0], bb[1], bb[2], bb[3]);
		}

		lineIndex.features = features;
		lineIndex.finish();

		console.log(
			'Spatial LineIndex mit ' +
				features.length +
				' Objekten in ' +
				(new Date().getTime() - currentL) +
				' ms angelegt.'
		);
	} else {
		lineIndex = new Flatbush(1);
		lineIndex.add(0, 0, 1, 1);
		lineIndex.features = [ {} ];
		lineIndex.finish();
		console.log('added dummy Spatial LineIndex  ');
	}
	// console.log('lIndex', lineIndex);

	// const response = await usersAPI.fetchAll();
	dispatch(initialize({ pointIndex, lineIndex }));
	finished();
};
