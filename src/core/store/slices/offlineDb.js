import { createSlice } from "@reduxjs/toolkit";
import * as offlineDatabase from "../../commons/offlineDbHelper";
import { getLoginFromJWT } from "./auth";

const LOCALSTORAGE_KEY = "@belis.app.offlineDB";
const initialState = {};
const slice = createSlice({
  name: "offlineDb",
  initialState,
  reducers: {
    storeDB(state, action) {
      state.db = action.payload;
      // localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
      return state;
    },
  },
});

export default slice;

export const { storeDB } = slice.actions;

export const getDB = (state) => {
  return state.offlineDb.db;
};

export const initialize = async (jwt, dispatch) => {
  const d = await offlineDatabase.createDb();

  if (d !== undefined) {
    let rep = new offlineDatabase.GraphQLReplicator(d);
    const errorCallback = (error) => {
      console.debug("error occured", error);
    };
    const changeCallback = (action) => {
      console.debug("change occured", action);
    };
    const login = getLoginFromJWT(jwt);
    rep.restart({ userId: login + "@belis", idToken: jwt }, errorCallback, changeCallback);
    dispatch(storeDB(d));
  } else {
    throw new Error("offline database not available", jwt);
  }
};
