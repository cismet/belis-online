import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "xxx",
  initialState: {},
  reducers: {
    set: (state, action) => action.payload,
  },
});

export default slice;

//actions
export const { set } = slice.actions;

//selectors
export const get = (state) => state.substatename;

//complex actions
export const doIt = () => async (dispatch) => {};
