import { createSlice } from "@reduxjs/toolkit";

const initialState = { bounds: undefined };

const slice = createSlice({
  name: "mapInfo",
  initialState,
  reducers: {
    setBounds(state, action) {
      state.bounds = action.payload;
      return state;
    },
  },
});

export default slice;

export const { setBounds } = slice.actions;

export const getBounds = (state) => {
  return state.mapInfo.bounds;
};
