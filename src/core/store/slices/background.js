import { createSlice } from '@reduxjs/toolkit';
const LOCALSTORAGE_KEY = '@belis.app.backgroundlayer';
const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || '"stadtplan"');

const slice = createSlice({
	name: 'background',
	initialState,
	reducers: {
		setBackground(state, action) {
			localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(action.payload));
			return action.payload;
		}
	}
});

export default slice;

export const { setBackground } = slice.actions;

export const getBackground = (state) => {
	return state.background;
};
