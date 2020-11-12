import { createSlice } from '@reduxjs/toolkit';
const featureCollectionSlice = createSlice({
	name: 'featureCollection',
	initialState: [],
	reducers: {
		setFeatureCollection: (state, action) => action.payload
	}
});
export const { setFeatureCollection } = featureCollectionSlice.actions;

export const getFeatureCollection = (state) => state.featureCollection;

export default featureCollectionSlice;
