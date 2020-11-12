import { createSlice } from '@reduxjs/toolkit';
import { dbPromise } from '../../indexeddb/db';

const spatialIndexSlice = createSlice({
	name: 'spatialIndex',
	initialState: {
		loading: undefined,
		index: undefined
	},
	reducers: {
		startLoading(state, action) {
			if (state.loading === undefined) {
				state.loading = 'started';
			}
		},
		initialize(state, action) {
			state.loading = 'done';
			state.index = action.payload;
		}
	}
});

export default spatialIndexSlice;

export const { startLoading, initialize } = spatialIndexSlice.actions;

export const initIndex = () => async (dispatch) => {
	dispatch(startLoading());
	const db = await dbPromise;
	let cursor = await db.transaction('abzweigdose').store.openCursor();
	while (cursor) {
		console.log(cursor.key, cursor.value);
		cursor = await cursor.continue();
	}
	// const response = await usersAPI.fetchAll();
	// dispatch(usersReceived(response.data));
};
