import { createSlice } from "@reduxjs/toolkit";

const initialState = { layer: "stadtplan" };

const slice = createSlice({
  name: "background",
  initialState,
  reducers: {
    setBackground(state, action) {
      state.layer = action.payload;
      return state;
    },
  },
});

export default slice;

export const { setBackground } = slice.actions;

export const getBackground = (state) => {
  return state.background.layer;
};
