import { createSlice } from '@reduxjs/toolkit';

const cacheSlice = createSlice({
	name: 'cache',
	initialState: {},
	reducers: {
		inc(state, action) {
			return { counter: state.counter + 1 };
		},
		dec(state, action) {
			return { counter: state.counter - 1 };
		}
	}
});

export default cacheSlice;

export const { inc, dec } = cacheSlice.actions;

export const getCounter = (state) => {
	return state.testCounter.counter;
};

const fillCache = () => async (dispatch) => {
	// const response = await usersAPI.fetchAll();
	// dispatch(usersReceived(response.data));
};
