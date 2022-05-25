import {
  getFeatureCollection,
  getFilter,
  getSelectedFeature,
  MODES,
  setDone,
  setDoneForMode,
  setFeatureCollection,
  setFeatureCollectionForMode,
  setFeatureCollectionInfo,
  setFeatureCollectionInfoForMode,
  setMode,
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
import { loadProtocollsIntoFeatureCollection } from "./protocolls";
const dexieW = dexieworker();

export const loadTaskListsIntoFeatureCollection = ({
  team,
  jwt,
  onlineDataForcing = false,
  done = () => {},
}) => {
  return async (dispatch, getState) => {
    dispatch(setDoneForMode({ mode: MODES.TASKLISTS, done: false }));

    console.log("xxx Arbeitsaufträge für Team " + team?.name + " suchen");

    const gqlQuery = `query q($teamId: Int) {${queries.arbeitsauftraegexx}}`;

    const queryParameter = { teamId: team.id };
    console.log("xxx query", { gqlQuery, queryParameter }, jwt);

    (async () => {
      try {
        console.time("xxx query returned");
        const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);
        console.timeEnd("xxx query returned");
        console.log("xxx response", response.data);
        const results = response.data.arbeitsauftrag;
        const features = [];
        for (const arbeitsauftrag of results) {
          const feature = {
            text: "-",
            id: "arbeitsauftrag." + arbeitsauftrag.id,
            enriched: false,
            type: "Feature",
            selected: false,
            featuretype: "arbeitsauftrag",
            geometry: geometryFactory(arbeitsauftrag),
            crs: {
              type: "name",
              properties: {
                name: "urn:ogc:def:crs:EPSG::25832",
              },
            },
            properties: arbeitsauftrag,
          };
          features.push(feature);
        }
        dispatch(setFeatureCollectionForMode({ mode: MODES.TASKLISTS, features }));
        dispatch(setFeatureCollectionInfoForMode({ mode: MODES.OBJECTS, info: { typeCount: 1 } }));
        dispatch(setMode(MODES.TASKLISTS));
        dispatch(setDoneForMode({ mode: MODES.TASKLISTS, done: true }));
        done();
      } catch (e) {
        console.error("xxx error ", e);
        dispatch(setDoneForMode({ mode: MODES.TASKLISTS, done: true }));
        done();
      }
    })();
  };
};

const geometryFactory = (arbeitsauftrag) => {
  const geoms = [];
  for (const arrayentry of arbeitsauftrag.ar_protokolleArray) {
    const prot = arrayentry.arbeitsprotokoll;
    if (prot?.geometrie?.geom?.geo_field) {
      geoms.push(createFeature(prot?.geometrie?.geom?.geo_field));
    }
    if (prot?.tdta_leuchten?.tdta_standort_mast?.geom?.geo_field) {
      geoms.push(createFeature(prot.tdta_leuchten.tdta_standort_mast.geom?.geo_field));
    }
    if (prot?.tdta_standort_mast?.geom?.geo_field) {
      geoms.push(createFeature(prot.tdta_standort_mast.geom?.geo_field));
    }
    if (prot?.schaltstelle?.geom?.geo_field) {
      geoms.push(createFeature(prot.schaltstelle.geom?.geo_field));
    }
    if (prot?.mauerlasche?.geom?.geo_field) {
      geoms.push(createFeature(prot.mauerlasche.geom?.geo_field));
    }
    if (prot?.leitung?.geom?.geo_field) {
      geoms.push(createFeature(prot.leitung.geom?.geo_field));
    }
    if (prot?.abzweigdose?.geom?.geo_field) {
      geoms.push(createFeature(prot.abzweigdose.geom?.geo_field));
    }
  }
  const turfCollection = turfHelpers.featureCollection(geoms);

  const convexFeature = convex(turfCollection);
  return convexFeature.geometry;
};

const createFeature = (geom) => {
  const feature = {
    type: "Feature",
    geometry: geom,
    // crs: {
    //   type: "name",
    //   properties: {
    //     name: "urn:ogc:def:crs:EPSG::25832",
    //   },
    // },
    properties: {},
  };
  const wgs84Feature = reproject.reproject(
    feature,
    projectionData["25832"].def,
    projectionData["4326"].def
  );
  const bufferedWGS84 = buffer(wgs84Feature, 25, { units: "meters" });
  const returnFeature = reproject.reproject(
    bufferedWGS84,
    projectionData["4326"].def,
    projectionData["25832"].def
  );
  return returnFeature;
};

export const tasklistPostSelection = (selectedFeature, jwt) => {
  return async (dispatch, getState) => {
    dispatch(loadProtocollsIntoFeatureCollection({ tasklistFeature: selectedFeature, jwt }));
  };
};
