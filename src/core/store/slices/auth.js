import { createSlice } from "@reduxjs/toolkit";
const LOCALSTORAGE_KEY = "@belis.app.jwt";
const initialState = { jwt: localStorage.getItem(LOCALSTORAGE_KEY) || "" };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeJWT(state, action) {
      console.log("yyy store jwt", action);
      state.jwt = action.payload;

      localStorage.setItem(LOCALSTORAGE_KEY, action.payload);

      return state;
    },
  },
});

export default slice;

export const { storeJWT } = slice.actions;

export const getJWT = (state) => {
  return state.jwt;
};
