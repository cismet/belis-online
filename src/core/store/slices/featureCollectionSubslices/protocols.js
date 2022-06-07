import {
  getFeatureCollection,
  getFilter,
  getOrigins,
  getSelectedFeature,
  MODES,
  setDone,
  setDoneForMode,
  setFeatureCollection,
  setFeatureCollectionForMode,
  setFeatureCollectionInfo,
  setFeatureCollectionInfoForMode,
  setMode,
  setOriginForMode,
  setRequestBasis,
  setSelectedFeature,
  setSelectedFeatureForMode,
  updateFeatureForMode,
} from "../featureCollection";
import { storeJWT } from "../auth";
import { fetchGraphQL } from "../../../commons/graphql";
import dexieworker from "workerize-loader!../../../workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import queries from "../../../queries/online";
import * as turfHelpers from "@turf/helpers";
import convex from "@turf/convex";
import buffer from "@turf/buffer";
import reproject from "reproject";
import { projectionData } from "react-cismap/constants/gis";
import { getDocs, getFachobjektOfProtocol } from "../../../helper/featureHelper";
import { CONNECTIONMODE, getConnectionMode } from "../app";
import { createArbeitsauftragFeaturesForResults } from "./tasklists";

//this function doesnt check if the app is in online or offline mode
//it just checks if the taskListFeature is enriched or not
// if it is already enriched it uses the ar_protokolleArray from the taskListFeature
// if not it fetches the protocolls from the backend

export const loadProtocollsIntoFeatureCollection = ({
  tasklistFeature,
  jwt,
  onlineDataForcing = false,
}) => {
  return async (dispatch, getState) => {
    const state = getState();
    const origin = getOrigins(state)[MODES.PROTOCOLS];

    const connectionMode = getConnectionMode(state);
    if (origin?.id !== tasklistFeature.id || connectionMode === CONNECTIONMODE.FROMCACHE) {
      dispatch(setDoneForMode({ mode: MODES.PROTOCOLS, done: false }));

      console.log("Protokolle für Arbeitsauftrag " + tasklistFeature.properties.id + " laden");

      const gqlQuery = `query q($aaId: Int) {${queries.full_arbeitsauftrag_by_id}}`;

      const queryParameter = { aaId: tasklistFeature.properties.id };

      (async () => {
        try {
          let features = [];
          if (tasklistFeature.enriched !== true) {
            console.time("query returned");
            const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);
            console.timeEnd("query returned");
            console.log("xxx response", response.data);

            const aaFeatures = createArbeitsauftragFeaturesForResults(
              response.data.arbeitsauftrag,
              true
            );
            console.log("aaFeature always 1", aaFeatures);
            const newAAReplacement = aaFeatures[0];
            newAAReplacement.selected = true;
            dispatch(updateFeatureForMode({ mode: MODES.TASKLISTS, feature: newAAReplacement }));
            const result = response.data.arbeitsauftrag[0];
            features = getFeaturesForProtokollArray(result.ar_protokolleArray);
          } else {
            features = getFeaturesForProtokollArray(tasklistFeature.properties.ar_protokolleArray);
          }
          dispatch(setFeatureCollectionForMode({ mode: MODES.PROTOCOLS, features }));
          dispatch(setOriginForMode({ mode: MODES.PROTOCOLS, origin: tasklistFeature }));
          dispatch(
            setFeatureCollectionInfoForMode({
              mode: MODES.PROTOCOLS,
              info: { typeCount: features.length },
            })
          );
          if (features.length === 1) {
            dispatch(
              setSelectedFeatureForMode({ mode: MODES.PROTOCOLS, selectedFeature: features[0] })
            );
          }
          dispatch(setDoneForMode({ mode: MODES.PROTOCOLS, done: true }));
        } catch (e) {
          console.error("xxx error ", e);
          dispatch(setDoneForMode({ mode: MODES.PROTOCOLS, done: true }));
        }
      })();
    } else {
      console.log("xxx origin is same as tasklist feature");
    }
  };
};

export const getFeaturesForProtokollArray = (protokollArray) => {
  const features = [];
  for (const entry of protokollArray) {
    const protokoll = entry.arbeitsprotokoll;
    const feature = getFeatureForProtokoll(protokoll);
    features.push(feature);
  }

  return features.sort((a, b) => a.properties.protokollnummer - b.properties.protokollnummer);
};

export const getFeatureForProtokoll = (protokoll) => {
  const fachobjekt = getFachobjektOfProtocol(protokoll);
  const feature = {
    text: "-",
    id: "arbeitsprotokoll." + protokoll.id,
    enriched: true,
    type: "Feature",
    selected: false,
    featuretype: "arbeitsprotokoll",
    fachobjekttype: fachobjekt.type,
    geometry: geometryFactory(protokoll),
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:EPSG::25832",
      },
    },
    properties: { ...protokoll, fachobjekt },
  };
  feature.properties.docs = getDocs(feature);
  return feature;
};

const geometryFactory = (prot) => {
  if (prot?.geometrie?.geom?.geo_field) {
    return prot?.geometrie?.geom?.geo_field;
  }
  if (prot?.tdta_leuchten?.fk_standort?.geom?.geo_field) {
    return prot.tdta_leuchten.fk_standort.geom?.geo_field;
  }
  if (prot?.tdta_standort_mast?.geom?.geo_field) {
    return prot.tdta_standort_mast.geom?.geo_field;
  }
  if (prot?.schaltstelle?.geom?.geo_field) {
    return prot.schaltstelle.geom?.geo_field;
  }
  if (prot?.mauerlasche?.geom?.geo_field) {
    return prot.mauerlasche.geom?.geo_field;
  }
  if (prot?.leitung?.geom?.geo_field) {
    return prot.leitung.geom?.geo_field;
  }
  if (prot?.abzweigdose?.geom?.geo_field) {
    return prot.abzweigdose.geom?.geo_field;
  }
};
