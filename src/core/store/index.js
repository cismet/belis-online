import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import spatialIndexSlice from './slices/spatialIndex';
import featureCollectionSlice from './slices/featureCollection';
import testSlice from './slices/test';
import mappingSlice from './slices/mapping';
import uiMessageSlice from './slices/uiMessage';
const store = configureStore({
	reducer: {
		spatialIndex: spatialIndexSlice.reducer,
		testCounter: testSlice.reducer,
		mapping: mappingSlice.reducer,
		featureCollection: featureCollectionSlice.reducer,
		uiMessage: uiMessageSlice.reducer
	},
	devTools: false && process.env.NODE_ENV !== 'production',
	middleware: [ ...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false }) ]
});

export default store;
