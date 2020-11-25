import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
	name: 'search',
	initialState: {
		active: true,
		wished: true
	},
	reducers: {
		setActive(state, action) {
			state.active = action.payload;
		},
		setWished(state, action) {
			state.wished = action.payload;
		},
		setSearchModeState(state, action) {
			return action.payload;
		}
	}
});

export default slice;

export const { setActive, setWished, setSearchModeState } = slice.actions;

export const isSearchModeActive = (state) => {
	return state.search.active;
};
export const isSearchModeWished = (state) => {
	return state.search.wished;
};
