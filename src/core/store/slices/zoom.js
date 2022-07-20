import { createSlice } from "@reduxjs/toolkit";

const zoomSlice = createSlice({
  name: "zoom",
  initialState: -1,
  reducers: {
    setZoom(state, action) {
      return action.payload;
    },
  },
});

export default zoomSlice;

export const { setZoom } = zoomSlice.actions;

export const getZoom = (state) => {
  return state.zoom;
};
