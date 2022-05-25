import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const slice = createSlice({
  name: "paleMode",
  initialState,
  reducers: {
    setPaleModeActive(state, action) {
      state.mode = action.payload;
      return state;
    },
  },
});

export default slice;

export const { setPaleModeActive } = slice.actions;

export const isPaleModeActive = (state) => {
  return state.paleMode.mode;
};
