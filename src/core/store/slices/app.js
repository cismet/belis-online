import { createSlice } from "@reduxjs/toolkit";

const LOCALSTORAGE_KEY = "@belis.app.state";
export const CONNECTIONMODE = { FROMCACHE: "FROMCACHE", ONLINE: "ONLINE" };

const initialState = JSON.parse(
  localStorage.getItem(LOCALSTORAGE_KEY) ||
    JSON.stringify({
      connectionMode: CONNECTIONMODE.ONLINE,
    })
);

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConnectionMode: (state, action) => {
      state.connectionMode = action.payload;
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
    },
    showDialog(state, action) {
      state.dialog = action.payload;
      return state;
    },
  },
});

export default slice;

//actions
export const { setConnectionMode, showDialog } = slice.actions;

//selectors
export const getConnectionMode = (state) => state.app.connectionMode;
export const getDialog = (state) => {
  return state.app.dialog;
};
