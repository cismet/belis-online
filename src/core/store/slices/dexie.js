import { createSlice } from "@reduxjs/toolkit";
import dexieworker from "workerize-loader!../../workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax

const slice = createSlice({
  name: "dexie",
  initialState: { worker: dexieworker() },
  reducers: {},
});

export default slice;

//actions

//selectors
export const getWorker = (state) => state.dexie.worker;
