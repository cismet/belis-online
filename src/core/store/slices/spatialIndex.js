import { createSlice } from '@reduxjs/toolkit';
import { dbPromise } from '../../indexeddb/db';
import kdbush from 'kdbush';

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
			console.log('in reducer', action);

			state.loading = 'done';
			state.index = action.payload;
		}
	}
});

export default spatialIndexSlice;

export const { startLoading, initialize } = spatialIndexSlice.actions;

export const getIndex = (state) => state.spatialIndex.index;
export const getLoadingState = (state) => state.spatialIndex.loading;

export const initIndex = (finished = () => {}) => async (dispatch) => {
	dispatch(startLoading());
	const db = await dbPromise;
	const current = new Date().getTime();

	const getEntityNameForRawEntry = (entry) => entry.tablename;

	const items = await db.getAll('raw_point_index');
	console.log('items', items.length);

	const coordinatesResolver = (o) => {
		try {
			return [ o.x, o.y ];
		} catch (e) {
			console.log('probblem in ', o);
			return [ -1, -1 ];
		}
	};
	console.log('creating index');

	const index = new kdbush(
		items,
		(p) => coordinatesResolver(p)[0],
		(p) => coordinatesResolver(p)[1]
	);

	console.log('dauerte ', new Date().getTime() - current);
	console.log('index ', index);

	// const response = await usersAPI.fetchAll();
	dispatch(initialize(index));
	finished();
};
