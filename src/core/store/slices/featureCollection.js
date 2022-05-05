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
import onlineQueryParts, { geomFactories, fragments } from "../../queries/full";
import { storeJWT } from "../slices/auth";
import {
  addPropertiesToFeature,
  compareFeature,
  integrateIntermediateResults,
  getIntermediateResultsToBeRemoved,
  getDocs,
} from "../../helper/featureHelper";
import proj4 from "proj4";
import { MappingConstants } from "react-cismap";
import { getIntermediateResults, removeIntermediateResults } from "./offlineActionDb";
import booleanIntersects from "@turf/boolean-intersects";
const dexieW = dexieworker();

const focusedSearchMinimumZoomThreshhold = 16.5;
const searchMinimumZoomThreshhold = 17.5;

export const initialFilter = {
  tdta_leuchten: { title: "Leuchten", enabled: true },
  tdta_standort_mast: { title: "Masten (ohne Leuchten)", enabled: true },
  mauerlasche: { title: "Mauerlaschen", enabled: true },
  leitung: { title: "Leitungen", enabled: true },
  schaltstelle: { title: "Schaltstellen", enabled: true },
  abzweigdose: { title: "Abzweigdosen", enabled: true },
};
const initialInFocusMode = false;

const featureCollectionSlice = createSlice({
  name: "featureCollection",
  initialState: {
    features: [],
    featuresMap: {},
    info: {},
    done: true,
    filter: initialFilter,
    selectedFeature: null,
    requestBasis: undefined,
    inFocusMode: initialInFocusMode,
    secondaryInfoVisible: false,
    overlayFeature: undefined,
    gazeteerHit: undefined,
    boundingBox: undefined,
  },
  reducers: {
    setFeatureCollection: (state, action) => {
      console.time("setFeatureCollection");
      state.features = action.payload;
      let index = 0;
      const fm = {};
      for (const f of state.features) {
        fm[f.id] = index++;
      }
      state.featuresMap = fm;
      console.timeEnd("setFeatureCollection");
    },
    setFeatureCollectionInfo: (state, action) => {
      state.info = action.payload;
    },

    setDone: (state, action) => {
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
    setSelectedFeature: (state, action) => {
      console.time("setSelectedFeature");
      const fc = state.features; //JSON.parse(JSON.stringify(state.features));
      console.log("setSelectedFeature", action.payload);

      if (state.selectedFeature) {
        // const oldSelectedFeature = fc.find((f) => f.id === state.selectedFeature.id);
        const oldSelectedFeature = fc[state.featuresMap[state.selectedFeature.id]];
        if (oldSelectedFeature) {
          oldSelectedFeature.selected = false;
        }
      }

      // if (action.payload) {
      //   action.payload.selected = true;
      // }

      // for (const f of newFC) {
      //   if (
      //     action.payload &&
      //     f.featuretype === action.payload.featuretype &&
      //     f.properties.id === action.payload.properties.id
      //   ) {
      //     f.selected = true;
      //   } else {
      //     f.selected = false;
      //   }
      // }
      // state.features = newFC;

      if (action.payload) {
        // state.selectedFeature = fc.find((f) => f.id === action.payload.id);
        state.selectedFeature = fc[state.featuresMap[action.payload.id]];
      }
      if (state.selectedFeature) {
        state.selectedFeature.selected = true;
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

export const forceRefresh = () => {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(setFeatureCollection([]));
    dispatch(setSelectedFeature(null));
    const onlineDataForcing = false;
    dispatch(
      loadObjects({
        boundingBox: state.featureCollection.boundingBox,
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

        dispatch(
          loadObjectsIntoFeatureCollection({ boundingBox: xbb, jwt: jwt, onlineDataForcing })
        );
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
  onlineDataForcing = false,
}) => {
  console.log("will loadObjectsIntoFeatureCollection");

  if (boundingBox) {
    //const boundingBox=
    return async (dispatch, getState) => {
      dispatch(setDone(false));
      const state = getState();
      const connectionMode = getConnectionMode(state);
      const filter = getFilter(state);
      // const selectedFeature=
      const convertedBoundingBox = convertBoundingBox(boundingBox);
      if (
        onlineDataForcing ||
        state.spatialIndex.loading === "done" ||
        connectionMode === CONNECTIONMODE.ONLINE
      ) {
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

            //double check if the feature is in the bounding box
            //till now we only have a rough intersction of the lines bbox
            //this will now do a real intersection and filter out the lines that are not in the bbox
            const bbox25832 = convertBoundingBox(boundingBox);
            const bboxGeom = bboxPolygon([
              bbox25832.left,
              bbox25832.top,
              bbox25832.right,
              bbox25832.bottom,
            ]).geometry;

            //this filter doenst work in safari
            //leitungsFeatures = leitungsFeatures.filter((f) => booleanIntersects(f, bboxGeom));

            //...therefore we do it the old fashioned way

            const intersectingLeitungsFeatures = [];
            for (const f of leitungsFeatures) {
              if (booleanIntersects(f, bboxGeom)) {
                intersectingLeitungsFeatures.push(f);
              }
            }
            leitungsFeatures = intersectingLeitungsFeatures;
          }
        } else {
        }
        // console.log('leitungsFeatures', leitungsFeatures);

        console.log("yyy", leitungsFeatures);

        if (connectionMode === CONNECTIONMODE.FROMCACHE && onlineDataForcing === false) {
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
          console.log("query", { gqlQuery, queryParameter });

          try {
            console.time("query returned");
            const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);
            console.timeEnd("query returned");

            if (response) {
              console.log("query response ", response);

              const featureCollection = [];
              const updates = response.data;
              for (const key of Object.keys(response.data || {})) {
                const objects = response.data[key];
                for (const o of objects) {
                  const feature = {
                    text: "-",
                    id: key,
                    enriched: true,
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
                  feature.properties.docs = getDocs(feature);
                  featureCollection.push(feature);
                }
              }
              //featureCollection[0].selected = true;
              // dispatch(setFeatureCollection(featureCollection));
              enrichAndSetFeatures(dispatch, state, featureCollection, true);
              console.log("will updateSingleCacheItems");

              //dexieW.updateSingleCacheItems(updates);
              console.log("updateSingleCacheItems done");
              console.log("loadObjectsIntoFeatureCollection done");
            } else {
              console.log("response was undefined");
              // dispatch(setRequestBasis(undefined));
              dispatch(storeJWT(undefined));
            }
          } catch (e) {
            console.log("error was thrown", e);
            console.log("errorneous query", { gqlQuery, queryParameter, jwt });
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
  console.log("entry enrichAndSetFeatures");
  console.time("features enirched");

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
      console.timeEnd("features enirched");
      const sortedElements = [];
      const typeCount = {};
      let selectionStillInMap = false;
      console.log("will do cycling through enriched fc");
      console.time("cycling through enriched fc");

      for (const feature of enrichedFeatureCollection) {
        feature.intermediateResultsIntegrated = new Date().getTime();
        //  console.log("feature", feature.intermediateResultsIntegrated, feature);
        if (removeFromIntermediateResults === true) {
          const throwAway = getIntermediateResultsToBeRemoved(feature);
          intermediateResultsToBeRemoved = [...intermediateResultsToBeRemoved, ...throwAway];
        } else {
          integrateIntermediateResults(feature, state.offlineActionDb.intermediateResults);
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
      console.timeEnd("cycling through enriched fc");

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
      console.log("will setFeatureCollection");
      // console.log("sortedElements", sortedElements);

      dispatch(setFeatureCollection(sortedElements));
      console.log("setFeatureCollection done");

      dispatch(setDone(true));
    },
    (error) => {
      alert("problem" + error);
      //todo: do something
    }
  );
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
