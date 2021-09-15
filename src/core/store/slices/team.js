import { createSlice } from "@reduxjs/toolkit";
const LOCALSTORAGE_KEY = "@belis.app.team";
const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || { id: -1, name: "-" }; //;

const slice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeam(state, action) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export default slice;

export const { setTeam } = slice.actions;

export const getTeam = (state) => {
  return state.team;
};
