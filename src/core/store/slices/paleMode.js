import { createSlice } from "@reduxjs/toolkit";
const LOCALSTORAGE_KEY = "@belis.app.inPaleMode";

const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || "false");

const slice = createSlice({
  name: "inPaleMode",
  initialState,
  reducers: {
    setPaleModeActive(state, action) {
      localStorage.setItem(LOCALSTORAGE_KEY, action.payload);
      return action.payload;
    },
  },
});

export default slice;

export const { setPaleModeActive } = slice.actions;

export const isPaleModeActive = (state) => {
  return state.inPaleMode;
};
