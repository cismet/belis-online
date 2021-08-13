import { createSlice } from "@reduxjs/toolkit";
import dexieworker from "workerize-loader!../../workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import { initIndex } from "./spatialIndex";
import {
  isSearchModeActive,
  isSearchModeWished,
  setActive as setSearchModeActive,
  setWished as setSearchModeWished,
} from "./search";
import { getZoom } from "./zoom";
import { getConnectionMode, CONNECTIONMODE } from "./app";
import bboxPolygon from "@turf/bbox-polygon";
import { fetchGraphQL } from "../../commons/graphql";
import onlineQueryParts, { geomFactories } from "../../queries/online";
// ----

const LOCALSTORAGE_KEY_IN_FOCUS_MODE = "@belis.app.inFocusMode";

const dexieW = dexieworker();
const focusedSearchMinimumZoomThreshhold = 12.5;
const searchMinimumZoomThreshhold = 13.5;

const LOCALSTORAGE_KEY_FILTER = "@belis.app.filter";

const initialFilter = JSON.parse(
  localStorage.getItem(LOCALSTORAGE_KEY_FILTER) ||
    JSON.stringify({
      tdta_leuchten: { title: "Leuchten", enabled: true },
      tdta_standort_mast: { title: "Masten (ohne Leuchten)", enabled: true },
      mauerlasche: { title: "Mauerlaschen", enabled: true },
      leitung: { title: "Leitungen", enabled: true },
      schaltstelle: { title: "Schaltstellen", enabled: true },
      abzweigdose: { title: "Abzweigdosen", enabled: true },
    })
);
const initialInFocusMode =
  JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY_IN_FOCUS_MODE)) || false;

const featureCollectionSlice = createSlice({
  name: "featureCollection",
  initialState: {
    features: [],
    done: true,
    filter: initialFilter,
    selectedFeature: null,
    requestBasis: undefined,
    inFocusMode: initialInFocusMode,
    secondaryInfoVisible: false,
  },
  reducers: {
    setFeatureCollection: (state, action) => {
      state.features = action.payload;
    },
    setSortedItems: (state, action) => {
      state.sortedItems = action.payload;
    },
    setDone: (state, action) => {
      state.done = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      localStorage.setItem(LOCALSTORAGE_KEY_FILTER, JSON.stringify(action.payload));
    },
    setSelectedFeature: (state, action) => {
      const newFC = JSON.parse(JSON.stringify(state.features));
      for (const f of newFC) {
        if (
          f.featuretype === action.payload.featuretype &&
          f.properties.id === action.payload.properties.id
        ) {
          f.selected = true;
          console.log("yyyy f " + f.featuretype + " is selected ", f);
        } else {
          f.selected = false;
        }
      }
      state.selectedFeature = action.payload;
      state.features = newFC;
    },
    setSelectedFeatureVis: (state, action) => {
      state.selectedFeatureVis = action.payload;
    },
    setRequestBasis: (state, action) => {
      state.requestBasis = action.payload;
    },
    setFocusModeActive: (state, action) => {
      state.inFocusMode = action.payload;
      localStorage.setItem(LOCALSTORAGE_KEY_IN_FOCUS_MODE, JSON.stringify(action.payload));
    },
    setSecondaryInfoVisible: (state, action) => {
      state.secondaryInfoVisible = action.payload;
    },
  },
});
export const {
  setFeatureCollection,
  setSortedItems,
  setDone,
  setFilter,
  setSelectedFeature,
  setSelectedFeatureVis,
  setRequestBasis,
  setFocusModeActive,
  setSecondaryInfoVisible,
} = featureCollectionSlice.actions;

export const getFeatureCollection = (state) => {
//  console.log("yyy getFeatureCollection", state.featureCollection.features);

  return state.featureCollection.features;
};
export const getSortedItems = (state) => {
  return state?.featureCollection?.sortedItems;}
export const isDone = (state) => state.featureCollection.done;
export const getFilter = (state) => state.featureCollection.filter;
export const getSelectedFeature = (state) => state?.featureCollection?.selectedFeature;
export const getSelectedFeatureVis = (state) => state?.featureCollection?.selectedFeatureVis;
const getRequestBasis = (state) => state.featureCollection.requestBasis;
export const isInFocusMode = (state) => state.featureCollection.inFocusMode;
export const isSecondaryInfoVisible = (state) => state.featureCollection.secondaryInfoVisible;

export default featureCollectionSlice;

const createQueryGeomFromB = (boundingBox) => {
  const geom = bboxPolygon([
    boundingBox.left,
    boundingBox.top,
    boundingBox.right,
    boundingBox.bottom,
  ]).geometry;
  geom.crs = {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:EPSG::25832",
    },
  };
  return geom;
};

export const loadObjects = ({ boundingBox, _inFocusMode, zoom, overridingFilterState, jwt }) => {
  return async (dispatch, getState) => {
    if (!jwt) {
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

      if (reqBasis !== requestBasis) {
        dispatch(setRequestBasis(reqBasis));

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

        dispatch(loadObjectsIntoFeatureCollection({ boundingBox: xbb, jwt: jwt }));
      } else {
        //console.log('xxx duplicate forceShowObjects');
      }
    }
  };
};

export const loadObjectsIntoFeatureCollection = ({
  boundingBox,
  _inFocusMode,
  _zoom,
  _overridingFilterState,
  jwt,
}) => {
  return async (dispatch, getState) => {
    dispatch(setDone(false));

    const state = getState();
    const connectionMode = getConnectionMode(state);
    const filter = getFilter(state);

    if (state.spatialIndex.loading === "done") {
      let resultIds, leitungsFeatures;
      if (connectionMode === CONNECTIONMODE.FROMCACHE) {
        resultIds = state.spatialIndex.pointIndex.range(
          boundingBox.left,
          boundingBox.bottom,
          boundingBox.right,
          boundingBox.top
        );

        //console.log('xxx alle resultIds da ', new Date().getTime() - d);

        leitungsFeatures = [];

        if (filter.leitung.enabled === true) {
          leitungsFeatures = state.spatialIndex.lineIndex
            .search(boundingBox.left, boundingBox.bottom, boundingBox.right, boundingBox.top)
            .map((i) => state.spatialIndex.lineIndex.features[i]);
          //console.log('xxx Leitungen ', new Date().getTime() - ld);
        }
      } else {
      }
      // console.log('leitungsFeatures', leitungsFeatures);

      if (connectionMode === CONNECTIONMODE.FROMCACHE) {
        dexieW
          .getFeaturesForHits(state.spatialIndex.pointIndex.points, resultIds, filter)
          .then((pointFeatureCollection) => {
            //console.log('xxx alle Features da ', new Date().getTime() - d);
            const featureCollection = leitungsFeatures.concat(pointFeatureCollection);
            //console.log('xxx alle Features da nach concat ', new Date().getTime() - d);

            //console.log('xxx vor setFeatureCollection');
            dispatch(setFeatureCollection(featureCollection));
            //setFC(featureCollection);
            //console.log('xxx nach  setFeatureCollection', new Date().getTime() - d);

            //console.log('xxx', '(done = true)');
            // dispatch(setDone(true));
            setTimeout(() => {
              dispatch(setDone(true));
            }, 1);
          });
      } else {
        let queryparts = "";
        for (const filterKey of Object.keys(filter)) {
          if (filter[filterKey].enabled === true) {
            const qp = onlineQueryParts[filterKey];
            queryparts += qp + "\n";
          }
        }
        const gqlQuery = `query q($bbPoly: geometry!) {${queryparts}}`;
        const queryParameter = { bbPoly: createQueryGeomFromB(boundingBox) };
        const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);

        const featureCollection = [];
        for (const key of Object.keys(response.data)) {
          const objects = response.data[key];
          for (const o of objects) {
            const feature = {
              text: "-",
              type: "Feature",
              selected: false,
              featuretype: key,
              geometry: geomFactories[key](o),
              crs: {
                type: "name",
                properties: {
                  name: "urn:ogc:def:crs:EPSG::25832",
                },
              },
              properties: {},
            };

            //The geometry could be deleted to save some memory
            //need to be a different approach in the geometryfactory then
            //not sure beacuse the properties would double up the memoryconsumption though
            //
            // const properties=JSON.parse(JSON.stringify(o));
            // delete propertiesgeomFactories[key](o)

            feature.properties = o;

            featureCollection.push(feature);
          }
        }
        //featureCollection[0].selected = true;
        dispatch(setFeatureCollection(featureCollection));

        dispatch(setDone(true));
      }
    } else {
      dispatch(
        initIndex(() => {
          dispatch(loadObjectsIntoFeatureCollection({ boundingBox, jwt: jwt }));
        })
      );
    }
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
