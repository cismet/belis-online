import { createSlice } from '@reduxjs/toolkit';
import cacheQueries from '../../queries/cache';
import dexieworker from 'workerize-loader!../../workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax
import { fetchGraphQL } from '../../commons/graphql';
import { initIndex } from './spatialIndex';

const LOCALSTORAGE_KEY = '@belis.app.cacheControl';

const dexieW = dexieworker();
const keys = [];
keys.push({
	primary: true,
	name: 'Masten (alle)',
	queryKey: 'all_tdta_standort_mast',
	dataKey: 'tdta_standort_mast'
});
keys.push({ primary: true, name: 'Masten (ohne Leuchten)', queryKey: 'tdta_standort_mast' });
keys.push({ primary: true, name: 'Punktindex', queryKey: 'raw_point_index' });
keys.push({ primary: true, name: 'Leitungen', queryKey: 'leitung' });
keys.push({ primary: true, name: 'Mauerlaschen', queryKey: 'mauerlasche' });
keys.push({ primary: true, name: 'Schaltstellen', queryKey: 'schaltstelle' });
keys.push({ primary: true, name: 'Leuchten', queryKey: 'tdta_leuchten' });
keys.push({ primary: true, name: 'Straßen', queryKey: 'tkey_strassenschluessel' });
keys.push({ primary: true, name: 'Abzweigdosen', queryKey: 'abzweigdose' });
keys.push({ name: 'Anlagengruppen', queryKey: 'anlagengruppe' });
keys.push({ name: 'Arbeitsprotokollstati', queryKey: 'arbeitsprotokollstatus' });
keys.push({ name: 'Bauarten', queryKey: 'bauart' });
keys.push({ name: 'Leitungstypen', queryKey: 'leitungstyp' });
keys.push({ name: 'Leuchtmittel', queryKey: 'leuchtmittel' });
keys.push({ name: 'Materialien (Leitungen)', queryKey: 'material_leitung' });
keys.push({ name: 'Materialien (Mauerlaschen)', queryKey: 'material_mauerlasche' });
keys.push({ name: 'Querschnitte', queryKey: 'querschnitt' });
keys.push({ name: 'Teams', queryKey: 'team' });
keys.push({ name: 'Bezirke', queryKey: 'tkey_bezirk' });
keys.push({ name: 'Doppelkommandos', queryKey: 'tkey_doppelkommando' });
keys.push({ name: 'Energielieferanten', queryKey: 'tkey_energielieferant' });
keys.push({ name: 'Kennziffern', queryKey: 'tkey_kennziffer' });
keys.push({ name: 'Klassifizierungen', queryKey: 'tkey_klassifizierung' });
keys.push({ name: 'Mastarten', queryKey: 'tkey_mastart' });
keys.push({ name: 'Unterhaltung (Leuchten)', queryKey: 'tkey_unterh_leuchte' });
keys.push({ name: 'Unterhaltung (Masten)', queryKey: 'tkey_unterh_mast' });
keys.push({ name: 'Veranlassungsarten', queryKey: 'veranlassungsart' });
keys.push({ name: 'Rundsteuerempfänger', queryKey: 'rundsteuerempfaenger' });
keys.push({ name: 'Leuchtentypen', queryKey: 'tkey_leuchtentyp' });
keys.push({ name: 'Masttypen', queryKey: 'tkey_masttyp' });

// keys.push({ name:"", queryKey: 'infobaustein' });

// keys.push({ name:"", queryKey: 'arbeitsprotokollaktion' });
// keys.push({ name:"", queryKey: 'infobaustein_temgstplate' });
// keys.push({ name:"", queryKey: 'arbeitsauftrag' });
// keys.push({ name:"", queryKey: 'arbeitsprotokoll' });
// keys.push({ name:"", queryKey: 'veranlassung' });

const objectStoreDefaultState = {
	loadingState: undefined, //"loading", "caching","cached"
	lastUpdate: -1, //new Date().getTime() Unix Epoch in UTC (Worldtime)
	objectCount: -1, //# of all objects
	updateCount: -1, //# of all retrieved objects
	cachingProgress: -1 //# of objects added to cache
};
const initialStateIfNotInLocalStorage = {};
for (const key of keys) {
	initialStateIfNotInLocalStorage[key.queryKey] = JSON.parse(
		JSON.stringify(objectStoreDefaultState)
	);
	initialStateIfNotInLocalStorage[key.queryKey].primary = key.primary;
	initialStateIfNotInLocalStorage[key.queryKey].dataKey = key.dataKey;
	initialStateIfNotInLocalStorage[key.queryKey].key = key.queryKey;
	initialStateIfNotInLocalStorage[key.queryKey].name = key.name || key.queryKey;
}
const initialState = JSON.parse(
	localStorage.getItem(LOCALSTORAGE_KEY) || JSON.stringify(initialStateIfNotInLocalStorage)
);

const cacheSlice = createSlice({
	name: 'cacheControl',
	initialState: initialState,
	reducers: {
		setLoadingState(state, action) {
			if (
				state[action.payload.key].resetTimer !== undefined &&
				action.payload.loadingState === 'loading'
			) {
				clearTimeout(state[action.payload.key].resetTimer);
				state[action.payload.key].resetTimer = undefined;
			}
			state[action.payload.key].loadingState = action.payload.loadingState;
			if (action.payload.resetTimer !== undefined) {
				state[action.payload.key].resetTimer = action.payload.resetTimer;
			}
			saveState(state);
			return state;
		},
		setLastUpdate(state, action) {
			state[action.payload.key].lastUpdate = action.payload.lastUpdate;
			saveState(state);
			return state;
		},
		setObjectCount(state, action) {
			state[action.payload.key].objectCount = action.payload.objectCount;
			saveState(state);
			return state;
		},
		setUpdateCount(state, action) {
			state[action.payload.key].updateCount = action.payload.updateCount;
			return state;
		},
		setCachingProgress(state, action) {
			state[action.payload.key].cachingProgress = action.payload.cachingProgress;
			return state;
		}
	}
});
const saveState = (state) => {
	const storedState = JSON.parse(JSON.stringify(state));
	Object.keys(storedState).forEach((key) => {
		delete storedState[key].loadingState;
	});
	localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(storedState));
};

export default cacheSlice;

export const {
	setLoadingState,
	setLastUpdate,
	setObjectCount,
	setUpdateCount,
	setCachingProgress
} = cacheSlice.actions;

export const getCacheSettings = (state) => {
	return state.cacheControl;
};

export const getCacheInfo = (key) => {
	return (state) => {
		return state.cacheControl[key];
	};
};

export const fillCacheInfo = () => {
	return async (dispatch, getState) => {
		const settings = getCacheSettings(getState());
		Object.keys(settings).forEach((key) => {
			dexieW.getCount(key).then((count) => {
				dispatch(setObjectCount({ key, objectCount: count }));
			});
		});
	};
};

export const renewCache = (key) => {
	return async (dispatch, getState) => {
		const state = getState();
		const cfg = getCacheInfo(key)(state);
		const itemKey = key;
		const dataKey = cfg.dataKey || key;

		dispatch(setLoadingState({ key, loadingState: 'loading' }));
		dispatch(setCachingProgress({ key, cachingProgress: 0 }));
		dispatch(setUpdateCount({ key, updateCount: 0 }));

		const progressListener = (message) => {
			if (message.data.progress !== undefined && message.data.objectstorename === itemKey) {
				dispatch(setCachingProgress({ key, cachingProgress: message.data.progress }));
			}
		};
		dexieW.addEventListener('message', progressListener);
		fetchGraphQL(cacheQueries[itemKey], {})
			.then((result, error) => {
				if (error !== undefined) {
					console.log('error in fetch ', error);
				} else {
					dispatch(setLastUpdate({ key, lastUpdate: new Date().getTime() }));

					console.log(
						itemKey + ' returned with ' + result.data[dataKey].length + ' results'
					);
					dispatch(setLoadingState({ key, loadingState: 'caching' }));
					dispatch(setObjectCount({ key, objectCount: result.data[dataKey].length }));
					dispatch(setUpdateCount({ key, updateCount: result.data[dataKey].length }));
					//async block
					(async () => {
						//put the data in the indexedDB
						const y = await dexieW.putArray(result.data[dataKey], itemKey);

						//reset loadingState in 1 minute
						const resetTimer = setTimeout(() => {
							dispatch(setLoadingState({ key, resetTimer, loadingState: undefined }));
						}, 60000);

						//set loading state done
						dispatch(setLoadingState({ key, resetTimer, loadingState: 'cached' }));

						//removeEVent Listener to free memory
						dexieW.removeEventListener('message', progressListener);

						if (itemKey === 'raw_point_index' || itemKey === 'leitung') {
							//to use the new data for the geometry search
							dispatch(
								initIndex(() => {})
							);
						}
					})();
				}
			})
			.catch(function(error) {
				console.log('error in fetch ', error);
			});
	};
};
