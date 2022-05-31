import { createSlice } from "@reduxjs/toolkit";
import cacheQueries from "../../queries/cacheFullObjects";
import dexieworker from "workerize-loader!../../workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import { fetchGraphQL } from "../../commons/graphql";
import { initIndex } from "./spatialIndex";
import { getLoginFromJWT } from "./auth";
import { clearIntermediateResults } from "./offlineActionDb";
import { useSelector } from "react-redux";
import { getWorker } from "./dexie";

const dexieW = dexieworker();

const keys = [];
// keys.push({
//   primary: true,
//   name: "Masten (alle)",
//   queryKey: "all_tdta_standort_mast",
//   dataKey: "tdta_standort_mast",
// });
keys.push({
  primary: true,
  name: "Leuchten",
  queryKey: "tdta_leuchten",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Masten (ohne Leuchten)",
  queryKey: "tdta_standort_mast",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Punktindex",
  queryKey: "raw_point_index",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Leitungen",
  queryKey: "leitung",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Mauerlaschen",
  queryKey: "mauerlasche",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Schaltstellen",
  queryKey: "schaltstelle",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Abzweigdosen",
  queryKey: "abzweigdose",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  name: "Teams",
  queryKey: "team",
  parameterFactory: () => ({}),
});
keys.push({
  primary: true,
  getName: (selectedTeam) => "Arbeitsaufträge (" + selectedTeam.name + ")",
  queryKey: "arbeitsauftrag",
  parameterFactory: (state) => ({ teamId: state.team.selectedTeam.id }),
});

const objectStoreDefaultState = {
  loadingState: undefined, //"loading", "caching","cached", "problem"
  lastUpdate: -1, //new Date().getTime() Unix Epoch in UTC (Worldtime)
  objectCount: -1, //# of all objects
  updateCount: -1, //# of all retrieved objects
  cachingProgress: -1, //# of objects added to cache
};
const initialTypeStateIfNotInLocalStorage = {};
const configx = {};
for (const key of keys) {
  initialTypeStateIfNotInLocalStorage[key.queryKey] = JSON.parse(
    JSON.stringify(objectStoreDefaultState)
  );
  initialTypeStateIfNotInLocalStorage[key.queryKey].primary = key.primary;
  initialTypeStateIfNotInLocalStorage[key.queryKey].dataKey = key.dataKey;
  initialTypeStateIfNotInLocalStorage[key.queryKey].key = key.queryKey;
  initialTypeStateIfNotInLocalStorage[key.queryKey].name = key.name || key.queryKey;
  configx[key.queryKey] = key;
}

console.log("config0", configx);

export const config = configx;
const initialState = {
  types: initialTypeStateIfNotInLocalStorage,
  user: undefined,
};

const cacheSlice = createSlice({
  name: "cacheControl",
  initialState: initialState,
  reducers: {
    setLoadingState(state, action) {
      if (
        state.types[action.payload.key].resetTimer !== undefined &&
        action.payload.loadingState === "loading"
      ) {
        clearTimeout(state.types[action.payload.key].resetTimer);
        state.types[action.payload.key].resetTimer = undefined;
      }
      state.types[action.payload.key].loadingState = action.payload.loadingState;
      if (action.payload.resetTimer !== undefined) {
        state.types[action.payload.key].resetTimer = action.payload.resetTimer;
      }

      return state;
    },
    setLastUpdate(state, action) {
      state.types[action.payload.key].lastUpdate = action.payload.lastUpdate;

      return state;
    },
    setObjectCount(state, action) {
      state.types[action.payload.key].objectCount = action.payload.objectCount;

      return state;
    },
    setUpdateCount(state, action) {
      state.types[action.payload.key].updateCount = action.payload.updateCount;
      return state;
    },
    setCachingProgress(state, action) {
      state.types[action.payload.key].cachingProgress = action.payload.cachingProgress;
      return state;
    },
    setCacheUser(state, action) {
      state.user = action.payload;
      return state;
    },
  },
});

export default cacheSlice;

export const {
  setLoadingState,
  setLastUpdate,
  setObjectCount,
  setUpdateCount,
  setCachingProgress,
  setCacheUser,
} = cacheSlice.actions;

export const getCacheSettings = (state) => {
  return state.cacheControl.types;
};
export const getCacheUser = (state) => {
  return state.cacheControl.user;
};

export const getCacheInfo = (key) => {
  return (state) => {
    return state.cacheControl.types[key];
  };
};

export const isCacheFullUsable = (state) => {
  for (const key of getAllInfoKeys(state)) {
    if (
      state.cacheControl.types[key].lastUpdate === undefined ||
      state.cacheControl.types[key].lastUpdate === -1 ||
      state.cacheControl.types[key].loadingState === "loading" ||
      state.cacheControl.types[key].loadingState === "caching"
    ) {
      return false;
    }
  }
  return true;
};

export const isSecondaryCacheUsable = (state) => {
  for (const key of getSecondaryInfoKeys(state)) {
    if (state.cacheControl.types[key].lastUpdate === -1) {
      return false;
    }
  }
  return true;
};

const getPrimaryInfoKeys = (state) => {
  return Object.keys(state.cacheControl.types).filter(
    (key) => state.cacheControl.types[key].primary === true
  );
};
const getSecondaryInfoKeys = (state) => {
  return Object.keys(state.cacheControl.types).filter(
    (key) => state.cacheControl.types[key].primary !== true
  );
};
const getAllInfoKeys = (state) => {
  return Object.keys(state.cacheControl.types);
};

export const getCacheDate = (state) => {
  let oldestUpdate = -1;
  for (const key of getAllInfoKeys(state)) {
    const update = state.cacheControl.types[key].lastUpdate;
    if (update === -1) {
      return -1;
    }
    if (oldestUpdate === -1 || oldestUpdate > update) {
      oldestUpdate = update;
    }
  }
  return oldestUpdate;
};

export const getCacheUpdatingProgress = (state) => {
  let progressCounter = 0;
  const keys = getPrimaryInfoKeys(state);
  for (const key of keys) {
    const loadingState = state.cacheControl.types[key].loadingState;
    if (loadingState === "cached" || loadingState === undefined) {
      progressCounter++;
    } else {
      // console.log("loadingState " + key, loadingState);
    }
  }
  return progressCounter / keys.length;
};

export const fillCacheInfo = () => {
  return async (dispatch, getState) => {
    const settings = getCacheSettings(getState());
    Object.keys(settings).forEach((key) => {
      dexieW.getCount(key).then((count) => {
        dispatch(setObjectCount({ key, objectCount: count }));
      });
    });
  };
};
export const deleteCacheDB = () => {
  return async (dispatch, getState) => {
    dexieW.deleteDB();
    dispatch(fillCacheInfo());
    const settings = getCacheSettings(getState());
    Object.keys(settings).forEach((key) => {
      console.log("key", key);
      dispatch(setLoadingState({ key, loadingState: undefined }));
      dispatch(setLastUpdate({ key, lastUpdate: undefined }));
    });
  };
};
export const renewAllSecondaryInfoCache = (jwt) => {
  return async (dispatch, getState) => {
    const state = getState();

    let index = 0;
    for (const key of Object.keys(state.cacheControl.types)) {
      if (state.cacheControl.types[key].primary !== true) {
        dispatch(renewCache(key, jwt));
      }
    }
  };
};
export const renewAllPrimaryInfoCache = (jwt) => {
  return async (dispatch, getState) => {
    const state = getState();

    let index = 0;
    for (const key of Object.keys(state.cacheControl.types)) {
      if (state.cacheControl.types[key].primary === true) {
        dispatch(renewCache(key, jwt));
      }
    }
    dispatch(setCacheUser(getLoginFromJWT(jwt)));
  };
};

export const renewCache = (key, jwt) => {
  console.log("xxx " + key, jwt);

  if (key === undefined || jwt === undefined) {
    console.error("renewCache: either key or jwt is undefined. This must be an error.");
  }
  return async (dispatch, getState) => {
    const state = getState();
    const cfg = getCacheInfo(key)(state);

    const itemKey = key;
    const dataKey = cfg.dataKey || key;

    dispatch(setLoadingState({ key, loadingState: "loading" }));
    dispatch(setCachingProgress({ key, cachingProgress: 0 }));
    dispatch(setUpdateCount({ key, updateCount: 0 }));

    const progressListener = (message) => {
      if (message.data.progress !== undefined && message.data.objectstorename === itemKey) {
        dispatch(setCachingProgress({ key, cachingProgress: message.data.progress }));
      }
    };
    dexieW.addEventListener("message", progressListener);
    console.log("cacheQueries[" + itemKey + "]", { gql: cacheQueries[itemKey] });
    if (itemKey === "arbeitsauftrag") {
      console.log("cacheControl.config[itemKey]", config[itemKey].parameterFactory(state));
    }

    fetchGraphQL(cacheQueries[itemKey], config[itemKey].parameterFactory(state), jwt)
      .then((result) => {
        // console.log(itemKey + " returned with " + result.data[dataKey].length + " results");
        console.log(itemKey + " returned with ", result.data[dataKey]);
        dispatch(setLoadingState({ key, loadingState: "caching" }));
        dispatch(setObjectCount({ key, objectCount: result.data[dataKey].length }));
        dispatch(setUpdateCount({ key, updateCount: result.data[dataKey].length }));
        //async block
        (async () => {
          //put the data in the indexedDB
          const y = await dexieW.putArray(result.data[dataKey], itemKey);

          //reset loadingState in 1 minute
          const resetTimer = setTimeout(() => {
            dispatch(setLoadingState({ key, resetTimer, loadingState: undefined }));
          }, 30000);

          //set loading state done
          dispatch(setLoadingState({ key, resetTimer, loadingState: "cached" }));
          dispatch(setLastUpdate({ key, lastUpdate: new Date().getTime() }));

          //remove the intermediate results of this datatype
          dispatch(clearIntermediateResults(key));

          //removeEVent Listener to free memory
          dexieW.removeEventListener("message", progressListener);

          if (itemKey === "raw_point_index") {
            //todo: the initIndex function should be called, after the cache was completely refreshed
            //to use the new data for the geometry search
            dispatch(initIndex(() => {}));
          }
        })();
        // }
      })
      .catch(function (error) {
        console.log("xxx error in fetch ", error);
        dispatch(setLoadingState({ key, loadingState: "problem" }));
        const resetTimer = setTimeout(() => {
          dispatch(setLoadingState({ key, resetTimer, loadingState: undefined }));
        }, 30000);
      });
  };
};
