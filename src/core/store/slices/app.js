import { createSlice } from "@reduxjs/toolkit";

export const CONNECTIONMODE = { FROMCACHE: "FROMCACHE", ONLINE: "ONLINE" };

const initialState = {
  connectionMode: CONNECTIONMODE.ONLINE,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setConnectionMode: (state, action) => {
      state.connectionMode = action.payload;
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
