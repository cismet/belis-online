import { createSlice } from '@reduxjs/toolkit';
import { dbPromise } from '../../indexeddb/db';
import kdbush from 'kdbush';
import Flatbush from 'flatbush';
import bbox from '@turf/bbox';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
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

	const pointItems = await db.getAll('raw_point_index');
	const leitungen = await db.getAll('leitung');

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
	const lineIndex = new Flatbush(features.length);

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

	// console.log('lIndex', lineIndex);

	// const response = await usersAPI.fetchAll();
	dispatch(initialize({ pointIndex, lineIndex }));
	finished();
};
