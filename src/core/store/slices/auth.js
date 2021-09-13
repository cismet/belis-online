import { createSlice } from "@reduxjs/toolkit";
const LOCALSTORAGE_KEY = "@belis.app.auth";
const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeJWT(state, action) {
      state.jwt = action.payload;
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
      return state;
    },
    storeLogin(state, action) {
      console.log("yyy store login", action);
      state.login = action.payload;
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
      return state;
    },
  },
});

export default slice;

export const { storeJWT, storeLogin } = slice.actions;

export const getJWT = (state) => {
  return state.auth.jwt;
};
export const getLogin = (state) => {
  return state.auth.login;
};

export const getLoginFromJWT = (jwt) => {
  if (jwt) {
    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload).sub;
  }
};
