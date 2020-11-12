import { createSlice } from '@reduxjs/toolkit';

const testSlice = createSlice({
	name: 'test',
	initialState: {
		counter: 0
	},
	reducers: {
		inc(state, action) {
			return { counter: state.counter + 1 };
		},
		dec(state, action) {
			return { counter: state.counter - 1 };
		}
	}
});

export default testSlice;

export const { inc, dec } = testSlice.actions;

export const getCounter = (state) => {
	return state.testCounter.counter;
};
