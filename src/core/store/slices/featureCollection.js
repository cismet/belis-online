import { createSlice } from '@reduxjs/toolkit';
import dexieworker from 'workerize-loader!../../workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax
import { initIndex } from './spatialIndex';
import { db as dexiedb } from '../../indexeddb/dexiedb';
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

const featureCollectionSlice = createSlice({
	name: 'featureCollection',
	initialState: {
		features: [],
		done: false,
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

export default featureCollectionSlice;
