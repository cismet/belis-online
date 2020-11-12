import { configureStore } from '@reduxjs/toolkit';
import spatialIndexSlice from './slices/spatialIndex';
const store = configureStore({
	reducer: {
		spatialIndex: spatialIndexSlice.reducer
	}
});

export default store;
