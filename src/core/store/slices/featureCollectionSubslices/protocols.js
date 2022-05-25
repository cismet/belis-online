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
import { getFachobjektOfProtocol } from "../../../helper/featureHelper";
const dexieW = dexieworker();

export const loadProtocollsIntoFeatureCollection = ({
  tasklistFeature,
  jwt,
  onlineDataForcing = false,
}) => {
  return async (dispatch, getState) => {
    const state = getState();
    const origin = getOrigins(state)[MODES.PROTOCOLS];
    if (origin?.id !== tasklistFeature.id) {
      dispatch(setDoneForMode({ mode: MODES.PROTOCOLS, done: false }));

      console.log("xxx Protokolle für Arbeitsauftrag " + tasklistFeature.properties.id + " suchen");

      const gqlQuery = `query q($aaId: Int) {${queries.singleArbeitsauftragFull}}`;

      const queryParameter = { aaId: tasklistFeature.properties.id };
      console.log("xxx query", { gqlQuery, queryParameter }, jwt);

      (async () => {
        try {
          console.time("xxx query returned");
          const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);
          console.timeEnd("xxx query returned");
          console.log("xxx response", response.data);
          const result = response.data.arbeitsauftrag[0];
          console.log("xxx result", result);

          const features = [];
          for (const entry of result.ar_protokolleArray) {
            const protokoll = entry.arbeitsprotokoll;
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
            features.push(feature);
          }
          dispatch(setFeatureCollectionForMode({ mode: MODES.PROTOCOLS, features }));
          dispatch(setOriginForMode({ mode: MODES.PROTOCOLS, origin: tasklistFeature }));
          dispatch(
            setFeatureCollectionInfoForMode({
              mode: MODES.PROTOCOLS,
              info: { typeCount: result.ar_protokolleArray.length },
            })
          );
          // dispatch(setMode(MODES.TASKLISTS));
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
