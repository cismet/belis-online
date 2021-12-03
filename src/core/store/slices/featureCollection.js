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
import { storeJWT } from "../slices/auth";
import {
  addPropertiesToFeature,
  compareFeature,
  integrateIntermediateResults,
  getIntermediateResultsToBeRemoved,
} from "../../helper/featureHelper";
import proj4 from "proj4";
import { MappingConstants } from "react-cismap";
import { getIntermediateResults, removeIntermediateResults } from "./offlineDb";

// ----

// const compareFeature = (a, b) => {
//   try {
//     if (a.featuretype < b.featuretype) {
//       return 1;
//     } else if (a.featuretype > b.featuretype) {
//       return -1;
//     } else {
//       return a.properties.compare(a.properties, b.properties);
//     }
//   } catch (e) {
//     console.log("error", e);
//     console.log("a", a);
//     console.log("b", b);

//     return -1;
//   }
// };

const featuresEqual = (a, b) => {
  if (a && b) {
    if (a.featuretype === b.featuretype) {
      return a.properties.id === b.properties.id;
    }
  }

  return false;
};
const LOCALSTORAGE_KEY_IN_FOCUS_MODE = "@belis.app.inFocusMode";

const dexieW = dexieworker();
const focusedSearchMinimumZoomThreshhold = 16.5;
const searchMinimumZoomThreshhold = 17.5;

const LOCALSTORAGE_KEY_FILTER = "@belis.app.filter";

export const initialFilter = JSON.parse(
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
    info: {},
    done: true,
    filter: initialFilter,
    selectedFeature: null,
    requestBasis: undefined,
    inFocusMode: initialInFocusMode,
    secondaryInfoVisible: false,
    overlayFeature: undefined,
    gazeteerHit: undefined,
  },
  reducers: {
    setFeatureCollection: (state, action) => {
      state.features = action.payload;
    },
    setFeatureCollectionInfo: (state, action) => {
      state.info = action.payload;
    },

    setDone: (state, action) => {
      state.done = action.payload;
    },
    setOverlayFeature: (state, action) => {
      state.overlayFeature = action.payload;
    },
    setGazetteerHit: (state, action) => {
      state.gazetteerHit = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      localStorage.setItem(LOCALSTORAGE_KEY_FILTER, JSON.stringify(action.payload));
    },
    setSelectedFeature: (state, action) => {
      const newFC = JSON.parse(JSON.stringify(state.features));

      for (const f of newFC) {
        if (
          action.payload &&
          f.featuretype === action.payload.featuretype &&
          f.properties.id === action.payload.properties.id
        ) {
          f.selected = true;
        } else {
          f.selected = false;
        }
      }

      state.features = newFC;

      state.selectedFeature = action.payload;
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
  setFeatureCollectionInfo,
  setDone,
  setFilter,
  setSelectedFeature,
  setRequestBasis,
  setFocusModeActive,
  setSecondaryInfoVisible,
  setOverlayFeature,
  setGazetteerHit,
} = featureCollectionSlice.actions;

export const getFeatureCollection = (state) => {
  return state.featureCollection.features;
};

export const isDone = (state) => state.featureCollection.done;
export const getFilter = (state) => state.featureCollection.filter;
export const getSelectedFeature = (state) => state?.featureCollection?.selectedFeature;
const getRequestBasis = (state) => state.featureCollection.requestBasis;
export const isInFocusMode = (state) => state.featureCollection.inFocusMode;
export const isSecondaryInfoVisible = (state) => state.featureCollection.secondaryInfoVisible;
export const getFeatureCollectionInfo = (state) => state.featureCollection.info;
export const getOverlayFeature = (state) => state.featureCollection.overlayFeature;
export const getGazetteerHit = (state) => state.featureCollection.gazetteerHit;

export default featureCollectionSlice;

const createQueryGeomFromBB = (boundingBox) => {
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

export const loadObjects = ({
  boundingBox,
  _inFocusMode,
  zoom,
  overridingFilterState,
  jwt,
  force = false,
}) => {
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

      if (reqBasis !== requestBasis || force) {
        if (force) {
          // console.log("xxx forced request ", boundingBox, new Error());
        } else {
          // console.log("xxx ordinary request", boundingBox, new Error());
        }
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
        // console.log("xxx duplicate requestBasis", boundingBox, new Error());
      }
    }
  };
};

export function convertBoundingBox(
  bbox,
  refDefIn = MappingConstants.proj4crs3857def,
  refDefOut = MappingConstants.proj4crs25832def
) {
  if (bbox) {
    const [left, top] = proj4(refDefIn, refDefOut, [bbox.left, bbox.top]);
    const [right, bottom] = proj4(refDefIn, refDefOut, [bbox.right, bbox.bottom]);
    return { left, top, right, bottom };
  }
}

export const loadObjectsIntoFeatureCollection = ({
  boundingBox,
  _inFocusMode,
  _zoom,
  _overridingFilterState,
  jwt,
}) => {
  if (boundingBox) {
    //const boundingBox=
    return async (dispatch, getState) => {
      dispatch(setDone(false));
      const state = getState();
      const connectionMode = getConnectionMode(state);
      const filter = getFilter(state);
      // const selectedFeature=
      const convertedBoundingBox = convertBoundingBox(boundingBox);

      if (state.spatialIndex.loading === "done" || connectionMode === CONNECTIONMODE.ONLINE) {
        let resultIds, leitungsFeatures;
        if (connectionMode === CONNECTIONMODE.FROMCACHE) {
          resultIds = state.spatialIndex.pointIndex.range(
            convertedBoundingBox.left,
            convertedBoundingBox.bottom,
            convertedBoundingBox.right,
            convertedBoundingBox.top
          );

          //console.log('xxx alle resultIds da ', new Date().getTime() - d);

          leitungsFeatures = [];

          if (filter.leitung.enabled === true) {
            leitungsFeatures = state.spatialIndex.lineIndex
              .search(
                convertedBoundingBox.left,
                convertedBoundingBox.bottom,
                convertedBoundingBox.right,
                convertedBoundingBox.top
              )
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
              enrichAndSetFeatures(dispatch, state, featureCollection, false);
              //console.log('xxx vor setFeatureCollection');
              //console.log("updated featureCollection ", featureCollection);

              // dispatch(setFeatureCollection(featureCollection));
              //setFC(featureCollection);
              //console.log('xxx nach  setFeatureCollection', new Date().getTime() - d);

              //console.log('xxx', '(done = true)');
              // dispatch(setDone(true));
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

          const queryParameter = { bbPoly: createQueryGeomFromBB(convertedBoundingBox) };
          // console.log("query", { gqlQuery, queryParameter });

          try {
            const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);
            if (response) {
              const featureCollection = [];
              for (const key of Object.keys(response.data || {})) {
                const objects = response.data[key];
                for (const o of objects) {
                  const feature = {
                    text: "-",
                    id: key,
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
                  feature.id = feature.id + "-" + o.id;

                  console.log("fresh loaded feature", feature);

                  featureCollection.push(feature);
                }
              }
              //featureCollection[0].selected = true;
              // dispatch(setFeatureCollection(featureCollection));
              enrichAndSetFeatures(dispatch, state, featureCollection, true);
            } else {
              console.log("response was undefined");
              // dispatch(setRequestBasis(undefined));
              dispatch(storeJWT(undefined));
            }
          } catch (e) {
            console.log("rerror was thrown", e);
            // dispatch(setRequestBasis(undefined));
            dispatch(setRequestBasis(undefined));
            dispatch(storeJWT(undefined));
          }
        }
      }
      // else {
      //   console.log("xxx loadObjects with index not done");

      //   dispatch(
      //     initIndex(() => {
      //       dispatch(
      //         loadObjectsIntoFeatureCollection({ boundingBox: convertedBoundingBox, jwt: jwt })
      //       );
      //     })
      //   );
      // }
    };
  }
};

const enrichAndSetFeatures = (
  dispatch,
  state,
  featureCollectionIn,
  removeFromIntermediateResults
) => {
  const tasks = [];

  const newFeatures = [];
  const currentFeatureCollection = getFeatureCollection(state);

  const stillInMap = currentFeatureCollection.filter((f) =>
    featureCollectionIn.find((test) => f.id === test.id)
  );
  const newInMap = featureCollectionIn.filter(
    (f) => stillInMap.find((test) => f.id === test.id) === undefined
  );
  // console.log("stillInMap", stillInMap);
  // console.log("newInMap", newInMap);
  // console.log("oldInMap", featureCollectionIn);
  const featureCollection = [...stillInMap, ...newInMap];
  //const featureCollection = featureCollectionIn;

  // prerendering featureCollection
  // needs to change listitems defauklt attributes to "... wird geladen"
  //dispatch(setFeatureCollection(featureCollection));

  for (const f of featureCollection) {
    tasks.push(addPropertiesToFeature(f));
  }
  const selectedFeature = getSelectedFeature(state);
  let intermediateResultsToBeRemoved = [];

  Promise.all(tasks).then(
    (enrichedFeatureCollection) => {
      const sortedElements = [];
      const typeCount = {};
      let selectionStillInMap = false;

      for (const feature of enrichedFeatureCollection) {
        feature.intermediateResultsIntegrated = new Date().getTime();
        //  console.log("feature", feature.intermediateResultsIntegrated, feature);
        if (removeFromIntermediateResults === true) {
          const throwAway = getIntermediateResultsToBeRemoved(feature);
          intermediateResultsToBeRemoved = [...intermediateResultsToBeRemoved, ...throwAway];
        } else {
          integrateIntermediateResults(feature, state.offlineDb.intermediateResults);
        }

        if (typeCount[feature.featuretype] === undefined) {
          typeCount[feature.featuretype] = 1;
        } else {
          typeCount[feature.featuretype] = typeCount[feature.featuretype] + 1;
        }

        if (feature.properties.is_deleted !== true) {
          sortedElements.push(feature);
          // console.log("shown feature", feature);
        } else {
          // console.log("deleted feature", feature);
        }
        // sortedElements.push(feature);

        if (selectedFeature && feature.id === selectedFeature.id) {
          selectionStillInMap = true;
          // feature.selected = true;
        }
      }

      sortedElements.sort(compareFeature);
      if (!selectionStillInMap) {
        dispatch(setSelectedFeature(null));
      }
      let index = 0;
      for (const f of sortedElements) {
        f.index = index++;
      }

      dispatch(removeIntermediateResults(intermediateResultsToBeRemoved));
      dispatch(setFeatureCollectionInfo({ typeCount }));
      dispatch(setFeatureCollection(sortedElements));
      console.log("xxx setFeatureCollection", sortedElements);

      dispatch(setDone(true));
    },
    (error) => {
      alert("problem" + error);
      //todo: do something
    }
  );
};

const _integrateIntermediateResults = (feature, intermediateResults) => {
  const now = new Date().getTime();
  const featuretype = feature.featuretype;
  const id = feature.properties.id;
  if (
    intermediateResults &&
    intermediateResults[featuretype] &&
    intermediateResults[featuretype][id]
  ) {
    const intermediateResultsForFeature = JSON.parse(
      JSON.stringify(intermediateResults[featuretype][id])
    );
    console.log("xxx intermediateResults", feature.properties.intermediateResults);

    feature.properties.intermediateResults = intermediateResultsForFeature;
    console.log("xxx intermediateResults", feature.properties.intermediateResults);

    console.log("xxx intermediate Result for feature " + feature.id, intermediateResultsForFeature);
  }
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
    const featureCollection = JSON.parse(JSON.stringify(getFeatureCollection(state)));

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
