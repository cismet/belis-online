import { createSlice } from "@reduxjs/toolkit";

const initialActive = true;
const initialWished = true;

const slice = createSlice({
  name: "search",
  initialState: {
    active: initialActive,
    wished: initialWished,
  },
  reducers: {
    setActive(state, action) {
      state.active = action.payload;
      return state;
    },
    setWished(state, action) {
      state.wished = action.payload;
      return state;
    },
    setSearchModeState(state, action) {
      state.active = action.payload.active;
      state.wished = action.payload.wished;
      return state;
    },
  },
});

export default slice;

export const { setActive, setWished, setSearchModeState } = slice.actions;

export const isSearchModeActive = (state) => {
  return state.search.active;
};
export const isSearchModeWished = (state) => {
  return state.search.wished;
};
