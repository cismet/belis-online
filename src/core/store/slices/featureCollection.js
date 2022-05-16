import { createSlice } from "@reduxjs/toolkit";

import { integrateIntermediateResults } from "../../helper/featureHelper";
import { convertBounds2BBox } from "../../helper/gisHelper";
import { loadObjectsIntoFeatureCollection } from "./featureCollectionSubslices/objects";
import { getIntermediateResults } from "./offlineActionDb";
import {
  isSearchModeActive,
  isSearchModeWished,
  setActive as setSearchModeActive,
  setWished as setSearchModeWished,
} from "./search";

import { getZoom } from "./zoom";

const focusedSearchMinimumZoomThreshhold = 16.5;
const searchMinimumZoomThreshhold = 17.5;
export const MODES = { OBJECTS: "OBJECTS", TASKLISTS: "TASKLISTS", PROTOCOLLS: "PROTOCOLLS" };

export const initialFilter = {
  tdta_leuchten: { title: "Leuchten", enabled: true },
  tdta_standort_mast: { title: "Masten (ohne Leuchten)", enabled: true },
  mauerlasche: { title: "Mauerlaschen", enabled: true },
  leitung: { title: "Leitungen", enabled: true },
  schaltstelle: { title: "Schaltstellen", enabled: true },
  abzweigdose: { title: "Abzweigdosen", enabled: true },
};
const initialInFocusMode = false;

const initForModes = (initionalizationValue) => {
  const ret = {};
  for (const mode of Object.values(MODES)) {
    ret[mode] = initionalizationValue;
  }
  return ret;
};

const featureCollectionSlice = createSlice({
  name: "featureCollection",
  initialState: {
    features: initForModes([]),
    featuresMap: initForModes({}),
    info: {},
    done: true,
    filter: initialFilter,
    selectedFeature: initForModes(null),
    requestBasis: undefined,
    inFocusMode: initialInFocusMode,
    secondaryInfoVisible: false,
    overlayFeature: undefined,
    gazeteerHit: undefined,
    boundingBox: undefined,
    mode: MODES.OBJECTS,
  },
  reducers: {
    setFeatureCollection: (state, action) => {
      console.time("setFeatureCollection");
      state.features[state.mode] = action.payload;
      let index = 0;
      const fm = {};
      for (const f of state.features[state.mode]) {
        fm[f.id] = index++;
      }
      state.featuresMap[state.mode] = fm;
      console.timeEnd("setFeatureCollection");
    },
    setFeatureCollectionInfo: (state, action) => {
      state.info = action.payload;
    },

    setDone: (state, action) => {
      console.log("setDone", action.payload);

      state.done = action.payload;
    },
    setBoundingBox: (state, action) => {
      state.boundingBox = action.payload;
    },
    setOverlayFeature: (state, action) => {
      state.overlayFeature = action.payload;
    },
    setGazetteerHit: (state, action) => {
      state.gazetteerHit = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },

    setSelectedFeatureForMode: (state, action) => {
      const { selectedFeature, mode } = action.payload;
      console.time("setSelectedFeature");
      const fc = state.features[mode]; //JSON.parse(JSON.stringify(state.features));

      console.log("setSelectedFeature", selectedFeature);

      if (state.selectedFeature[mode]) {
        // const oldSelectedFeature = fc.find((f) => f.id === state.selectedFeature.id);
        const oldSelectedFeature = fc[state.featuresMap[mode][state.selectedFeature[mode].id]];
        if (oldSelectedFeature) {
          oldSelectedFeature.selected = false;
        }
      }
      if (selectedFeature) {
        // state.selectedFeature = fc.find((f) => f.id === selectedFeature.id);
        state.selectedFeature[mode] = fc[state.featuresMap[mode][selectedFeature.id]];
      }
      if (state.selectedFeature[mode]) {
        state.selectedFeature[mode].selected = true;
      }
      console.timeEnd("setSelectedFeature");
    },

    setRequestBasis: (state, action) => {
      state.requestBasis = action.payload;
    },
    setFocusModeActive: (state, action) => {
      state.inFocusMode = action.payload;
    },
    setSecondaryInfoVisible: (state, action) => {
      state.secondaryInfoVisible = action.payload;
    },
  },
});
export const {
  setFeatureCollection,
  setFeatureCollectionInfo,
  setDone,
  setBoundingBox,
  setFilter,
  setSelectedFeatureForMode,
  setRequestBasis,
  setFocusModeActive,
  setSecondaryInfoVisible,
  setOverlayFeature,
  setGazetteerHit,
  setMode,
} = featureCollectionSlice.actions;

export const getFeatureCollection = (state) => {
  return state.featureCollection.features[state.featureCollection.mode];
};

export const isDone = (state) => state.featureCollection.done;
export const getFilter = (state) => state.featureCollection.filter;
export const getSelectedFeature = (state) =>
  state.featureCollection.selectedFeature[state.featureCollection.mode];
const getRequestBasis = (state) => state.featureCollection.requestBasis;
export const isInFocusMode = (state) => state.featureCollection.inFocusMode;
export const isSecondaryInfoVisible = (state) => state.featureCollection.secondaryInfoVisible;
export const getFeatureCollectionInfo = (state) => state.featureCollection.info;
export const getOverlayFeature = (state) => state.featureCollection.overlayFeature;
export const getGazetteerHit = (state) => state.featureCollection.gazetteerHit;

export default featureCollectionSlice;

export const setSelectedFeature = (selectedFeature) => {
  return (dispatch, getState) => {
    const mode = getState().featureCollection.mode;
    dispatch(setSelectedFeatureForMode({ selectedFeature, mode }));
  };
};

export const forceRefresh = () => {
  return async (dispatch, getState) => {
    const state = getState();
    console.log("xxx forceRefresh in", state.featureCollection.boundingBox, state.mapInfo?.bounds);
    dispatch(setFeatureCollection([]));
    dispatch(setSelectedFeature(null));
    const onlineDataForcing = false;
    dispatch(
      loadObjects({
        boundingBox:
          state.featureCollection.boundingBox || convertBounds2BBox(state.mapInfo.bounds),
        jwt: state.auth.jwt,
        force: true,
        onlineDataForcing,
      })
    );
  };
};

export const loadObjects = ({
  boundingBox,
  _inFocusMode,
  zoom,
  overridingFilterState,
  jwt,
  force = false,
  onlineDataForcing,
}) => {
  return async (dispatch, getState) => {
    if (!jwt || !boundingBox) {
      return;
    }

    const state = getState();
    const inFocusMode = _inFocusMode || isInFocusMode(state);
    const _searchForbidden = _isSearchForbidden({ inFocusMode }, state);
    const _filterState = getFilter(state);
    const searchModeWished = isSearchModeWished(state);
    let searchModeActive = isSearchModeActive(state);

    const requestBasis = getRequestBasis(state);

    if (_searchForbidden === true && searchModeActive === true) {
      dispatch(setSearchModeWished(true));
      dispatch(setSearchModeActive(false));
      return;
    } else if (
      _searchForbidden === false &&
      searchModeWished === true &&
      searchModeActive === false
    ) {
      dispatch(setSearchModeWished(true));
      dispatch(setSearchModeActive(true));
      searchModeActive = true; //because we use it directly
    } else if (_searchForbidden === false && searchModeActive === true) {
      dispatch(setSearchModeWished(true));
    }
    if (searchModeActive === true) {
      const _filterstate = overridingFilterState || _filterState;
      const reqBasis =
        JSON.stringify(boundingBox) + "." + JSON.stringify(_filterstate) + "." + inFocusMode;

      if (reqBasis !== requestBasis || force) {
        dispatch(setRequestBasis(reqBasis));
        dispatch(setBoundingBox(boundingBox));

        let xbb;
        if (inFocusMode) {
          const w = boundingBox.right - boundingBox.left;
          const h = boundingBox.top - boundingBox.bottom;

          const focusBB = {
            left: boundingBox.left + w / 4,
            top: boundingBox.top - h / 4,
            right: boundingBox.right - w / 4,
            bottom: boundingBox.bottom + h / 4,
          };
          xbb = focusBB;
        } else {
          xbb = boundingBox;
        }

        console.log("{ boundingBox: xbb, jwt: jwt, onlineDataForcing }", {
          boundingBox: xbb,
          jwt: jwt,
          onlineDataForcing,
        });

        dispatch(
          loadObjectsIntoFeatureCollection({ boundingBox: xbb, jwt: jwt, onlineDataForcing })
        );
      } else {
        // console.log("xxx duplicate requestBasis", boundingBox, new Error());
      }
    }
  };
};

export const reSetSelecteFeatureFromCollection = () => {
  return (dispatch, getState) => {
    const state = getState();
    const featureCollection = getFeatureCollection(state);
    const oldSelectedFeature = getSelectedFeature(state);
    const selectedFeature = featureCollection.find((f) => f.id === oldSelectedFeature.id);
    dispatch(setSelectedFeature(selectedFeature));
  };
};

export const integrateIntermediateResultsIntofeatureCollection = (intermediateResults) => {
  return async (dispatch, getState) => {
    const state = getState();
    // need to create a new featurecollection because the retrieved collection is immutable
    console.time("integrateIntermediateResultsIntofeatureCollection.clone.FC");
    const featureCollection = JSON.parse(JSON.stringify(getFeatureCollection(state)));
    console.timeEnd("integrateIntermediateResultsIntofeatureCollection.clone.FC");

    const _intermediateResults = intermediateResults || getIntermediateResults(state);
    for (const feature of featureCollection) {
      integrateIntermediateResults(feature, _intermediateResults);
    }

    //re set the featurecollection
    dispatch(setFeatureCollection(featureCollection));
    dispatch(reSetSelecteFeatureFromCollection());
  };
};

export const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isSearchForbidden = (state) => {
  return _isSearchForbidden(undefined, state);
};
//this allows us to override certain values in a time critical case
const _isSearchForbidden = (overrides = {}, state) => {
  let _zoom = overrides.zoom || getZoom(state);
  let inFocusMode = isInFocusMode(state);
  if (_zoom === -1) {
    _zoom = new URLSearchParams(window.location.search).get("zoom");
  }
  let ifm; //= overrides.inFocusMode || inFocusMode;
  if (overrides.inFocusMode !== undefined) {
    ifm = overrides.inFocusMode;
  } else {
    ifm = inFocusMode;
  }
  return (
    (ifm === true && _zoom < focusedSearchMinimumZoomThreshhold) ||
    (ifm === false && _zoom < searchMinimumZoomThreshhold)
  );
};
