import { createSlice } from '@reduxjs/toolkit';
import dexieworker from 'workerize-loader!../../workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax
import { initIndex } from './spatialIndex';
import {
	isSearchModeActive,
	isSearchModeWished,
	setActive as setSearchModeActive,
	setWished as setSearchModeWished,
	setSearchModeState
} from './search';
import { getZoom } from './zoom';

// ----

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
		filter: initialFilter,
		requestBasis: undefined,
		inFocusMode: false
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
		},
		setRequestBasis: (state, action) => {
			state.requestBasis = action.payload;
		},
		setFocusModeActive: (state, action) => {
			state.inFocusMode = action.payload;
		}
	}
});
export const {
	setFeatureCollection,
	setDone,
	setFilter,
	setRequestBasis,
	setFocusModeActive
} = featureCollectionSlice.actions;

export const getFeatureCollection = (state) => state.featureCollection.features;
export const isDone = (state) => state.featureCollection.done;
export const getFilter = (state) => state.featureCollection.filter;
const getRequestBasis = (state) => state.featureCollection.requestBasis;
export const isInFocusMode = (state) => state.featureCollection.inFocusMode;

export default featureCollectionSlice;

export const loadObjects = ({ boundingBox, inFocusMode, zoom, overridingFilterState }) => {
	return async (dispatch, getState) => {
		const state = getState();
		const _searchForbidden = isSearchForbidden({ inFocusMode }, state);
		const _filterState = getFilter(state);
		const searchModeWished = isSearchModeWished(state);
		let searchModeActive = isSearchModeActive(state);
		const requestBasis = getRequestBasis(state);

		if (_searchForbidden === true && searchModeActive === true) {
			dispatch(setSearchModeWished(true));
			dispatch(setSearchModeActive(false));
			return;
		} else if (
			_searchForbidden === false &&
			searchModeWished === true &&
			searchModeActive === false
		) {
			dispatch(setSearchModeWished(true));
			dispatch(setSearchModeActive(true));
			searchModeActive = true; //because we use it directly
		} else if (_searchForbidden === false && searchModeActive === true) {
			dispatch(setSearchModeWished(true));
		}
		if (searchModeActive === true) {
			const _filterstate = overridingFilterState || _filterState;
			const reqBasis = JSON.stringify(boundingBox) + '.' + JSON.stringify(_filterstate);

			if (reqBasis !== requestBasis) {
				dispatch(setRequestBasis(reqBasis));

				let xbb;
				if (inFocusMode) {
					const w = boundingBox.right - boundingBox.left;
					const h = boundingBox.top - boundingBox.bottom;

					const focusBB = {
						left: boundingBox.left + w / 4,
						top: boundingBox.top - h / 4,
						right: boundingBox.right - w / 4,
						bottom: boundingBox.bottom + h / 4
					};
					xbb = focusBB;
				} else {
					xbb = boundingBox;
				}

				dispatch(loadObjectsIntoFeatureCollection({ boundingBox: xbb }));
			} else {
				//console.log('xxx duplicate forceShowObjects');
			}
		}
	};
};

export const loadObjectsIntoFeatureCollection = ({
	boundingBox,
	_inFocusMode,
	_zoom,
	_overridingFilterState
}) => {
	return async (dispatch, getState) => {
		//console.log('xxx setBoundingBoxAndLoadObjects');
		dispatch(setDone(false));

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
	};
};

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const isSearchForbidden = (overrides = {}, state) => {
	let _zoom = overrides.zoom || getZoom(state);
	let inFocusMode = isInFocusMode(state);
	if (_zoom === -1) {
		_zoom = new URLSearchParams(window.location.search).get('zoom');
	}
	let ifm; //= overrides.inFocusMode || inFocusMode;
	if (overrides.inFocusMode !== undefined) {
		ifm = overrides.inFocusMode;
	} else {
		ifm = inFocusMode;
	}
	return (
		(ifm === true && _zoom < focusedSearchMinimumZoomThreshhold) ||
		(ifm === false && _zoom < searchMinimumZoomThreshhold)
	);
};
