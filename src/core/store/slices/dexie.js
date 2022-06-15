import { createSlice } from "@reduxjs/toolkit";
import dexieworker from "workerize-loader!../../workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import { db } from "../../indexeddb/dexiedb";

const slice = createSlice({
  name: "dexie",
  initialState: { worker: dexieworker(), db },
  reducers: {},
});

export default slice;

//actions

//selectors
export const getWorker = (state) => state.dexie.worker;
export const getDexieDB = (state) => state.dexie.db;
