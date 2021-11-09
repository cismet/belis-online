//kjdfh

import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import spatialIndexSlice from "./slices/spatialIndex";
import featureCollectionSlice from "./slices/featureCollection";
import searchSlice from "./slices/search";
import zoomSlice from "./slices/zoom";
import testSlice from "./slices/test";
import backgroundSlice from "./slices/background";
import paleModeSlice from "./slices/paleMode";
import cacheControlSlice from "./slices/cacheControl";
import uiMessageSlice from "./slices/uiMessage";
import appStateSlice from "./slices/app";
import authSlice from "./slices/auth";

import gazetteerDataSlice from "./slices/gazetteerData";
import teamSlice from "./slices/team";
import offlineDb from "./slices/offlineDb";
import photoLightboxSlice from "./slices/photoLightbox";
import { createLogger } from "redux-logger";
import "antd/dist/antd.css";

console.log("store initializing ....");
const devToolsEnabled =
  new URLSearchParams(window.location.search).get("devToolsEnabled") === "true";
console.log("devToolsEnabled:", devToolsEnabled);
const stateLoggingEnabledFromSearch = new URLSearchParams(window.location.search).get(
  "stateLoggingEnabled"
);
const stateLoggingEnabled =
  stateLoggingEnabledFromSearch !== null && stateLoggingEnabledFromSearch !== "false";

console.log("stateLoggingEnabled:", stateLoggingEnabledFromSearch, "x", stateLoggingEnabled);

const inProduction = process.env.NODE_ENV === "production";
console.log("in Production Mode:", inProduction);

const logger = createLogger({
  collapsed: true,
  // predicate, // if specified this function will be called before each action is processed with this middleware.
  // collapsed, // takes a Boolean or optionally a Function that receives `getState` function for accessing current store state and `action` object as parameters. Returns `true` if the log group should be collapsed, `false` otherwise.
  // duration = false: Boolean, // print the duration of each action?
  // timestamp = true: Boolean, // print the timestamp with each action?

  // level = 'log': 'log' | 'console' | 'warn' | 'error' | 'info', // console's level
  // colors: ColorsObject, // colors for title, prev state, action and next state: https://github.com/LogRocket/redux-logger/blob/master/src/defaults.js#L12-L18
  // titleFormatter, // Format the title used when logging actions.

  // stateTransformer, // Transform state before print. Eg. convert Immutable object to plain JSON.
  // actionTransformer, // Transform action before print. Eg. convert Immutable object to plain JSON.
  // errorTransformer, // Transform error before print. Eg. convert Immutable object to plain JSON.

  // logger = console: LoggerObject, // implementation of the `console` API.
  // logErrors = true: Boolean, // should the logger catch, log, and re-throw errors?

  // diff = false: Boolean, // (alpha) show diff between states?
  // diffPredicate // (alpha) filter function for showing states diff, similar to `predicate`
});
const middleware = [...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false })];
if (stateLoggingEnabled === true) {
  middleware.push(logger);
}
const store = configureStore({
  reducer: {
    app: appStateSlice.reducer,
    auth: authSlice.reducer,
    spatialIndex: spatialIndexSlice.reducer,
    testCounter: testSlice.reducer,
    featureCollection: featureCollectionSlice.reducer,
    search: searchSlice.reducer,
    zoom: zoomSlice.reducer,
    background: backgroundSlice.reducer,
    inPaleMode: paleModeSlice.reducer,
    cacheControl: cacheControlSlice.reducer,
    uiMessage: uiMessageSlice.reducer,
    gazetteerData: gazetteerDataSlice.reducer,
    team: teamSlice.reducer,
    offlineDb: offlineDb.reducer,
    photoLightbox: photoLightboxSlice.reducer,
  },
  devTools: devToolsEnabled === true && inProduction === false,
  middleware,
});

export default store;
