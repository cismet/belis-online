import { createSlice } from '@reduxjs/toolkit';
const LOCALSTORAGE_ACTIVE = '@belis.app.inSearchMode';
const LOCALSTORAGE_WISHED = '@belis.app.inSearchModeWish';

const initialActive = JSON.parse(localStorage.getItem(LOCALSTORAGE_ACTIVE) || 'true');
const initialWished = JSON.parse(localStorage.getItem(LOCALSTORAGE_WISHED) || 'true');

const slice = createSlice({
	name: 'search',
	initialState: {
		active: initialActive,
		wished: initialWished
	},
	reducers: {
		setActive(state, action) {
			state.active = action.payload;
			localStorage.setItem(LOCALSTORAGE_ACTIVE, action.payload);
		},
		setWished(state, action) {
			state.wished = action.payload;
			localStorage.setItem(LOCALSTORAGE_WISHED, action.payload);
		},
		setSearchModeState(state, action) {
			localStorage.setItem(LOCALSTORAGE_ACTIVE, action.payload.active);
			localStorage.setItem(LOCALSTORAGE_WISHED, action.payload.wished);
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
