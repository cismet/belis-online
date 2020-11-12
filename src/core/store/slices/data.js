import { createSlice } from '@redux/toolkit';

const dataSlice = createSlice({
	name: 'users',
	initialState: {
		loading: 'idle',
		data: []
	},
	reducers: {
		usersLoading(state, action) {
			// Use a "state machine" approach for loading state instead of booleans
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		usersReceived(state, action) {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.data = action.payload;
			}
		}
	}
});

// Destructure and export the plain action creators
export const { usersLoading, usersReceived } = dataSlice.actions;

// Define a thunk that dispatches those action creators
const fetchUsers = () => async (dispatch) => {
	dispatch(usersLoading());
	const response = await usersAPI.fetchAll();
	dispatch(usersReceived(response.data));
};
