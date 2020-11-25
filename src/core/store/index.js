import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import spatialIndexSlice from './slices/spatialIndex';
import featureCollectionSlice from './slices/featureCollection';
import searchSlice from './slices/search';

import testSlice from './slices/test';
import uiMessageSlice from './slices/uiMessage';
const store = configureStore({
	reducer: {
		spatialIndex: spatialIndexSlice.reducer,
		testCounter: testSlice.reducer,
		featureCollection: featureCollectionSlice.reducer,
		search: searchSlice.reducer,
		uiMessage: uiMessageSlice.reducer
	},
	devTools: process.env.NODE_ENV !== 'production',
	middleware: [ ...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }) ]
});

export default store;
