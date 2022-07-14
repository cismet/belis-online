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
  setSelectedFeatureForMode,
} from "../featureCollection";
import { getJWT, storeJWT } from "../auth";
import { fetchGraphQL } from "../../../commons/graphql";
import dexieworker from "workerize-loader!../../../workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import queries from "../../../queries/online";
import * as turfHelpers from "@turf/helpers";
import convex from "@turf/convex";
import buffer from "@turf/buffer";
import reproject from "reproject";
import { projectionData } from "react-cismap/constants/gis";
import { loadProtocollsIntoFeatureCollection } from "./protocols";
import { CONNECTIONMODE, getConnectionMode } from "../app";
const dexieW = dexieworker();

export const loadTaskListsIntoFeatureCollection = ({
  team,
  jwt,
  onlineDataForcing = false,
  done = () => {},
}) => {
  return async (dispatch, getState) => {
    const state = getState();
    const connectionMode = getConnectionMode(state);

    const storedJWT = getJWT(state);
    dispatch(setDoneForMode({ mode: MODES.TASKLISTS, done: false }));

    console.log("xxx Arbeitsaufträge für Team " + team?.name + " suchen");

    (async () => {
      try {
        let features = [];
        if (onlineDataForcing || connectionMode === CONNECTIONMODE.ONLINE) {
          console.log("xxx will get tasklist from server");

          const gqlQuery = `query q($teamId: Int) {${queries.arbeitsauftraege_by_team_only_protocolgeoms}}`;

          const queryParameter = { teamId: team.id };
          console.time("tasklist query returned");
          const response = await fetchGraphQL(gqlQuery, queryParameter, jwt);
          console.timeEnd("tasklist query returned");
          const results = response.data.arbeitsauftrag;

          features = createArbeitsauftragFeaturesForResults(results);
        } else {
          //offlineUse
          console.log("xxx will get tasklist from local cache");
          const results = await dexieW.getAll("arbeitsauftrag");
          features = createArbeitsauftragFeaturesForResults(results, true);
        }

        dispatch(setFeatureCollectionForMode({ mode: MODES.PROTOCOLS, features: [] }));
        dispatch(setSelectedFeatureForMode({ mode: MODES.PROTOCOLS, feature: undefined }));
        dispatch(setFeatureCollectionForMode({ mode: MODES.TASKLISTS, features }));
        dispatch(
          setFeatureCollectionInfoForMode({ mode: MODES.TASKLISTS, info: { typeCount: 1 } })
        );

        if (features.length === 1) {
          dispatch(
            setSelectedFeatureForMode({ mode: MODES.TASKLISTS, selectedFeature: features[0] })
          );
          dispatch(tasklistPostSelection(features[0], storedJWT));
        }
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

export const createArbeitsauftragFeaturesForResults = (results, enriched = false) => {
  const features = [];
  for (const arbeitsauftrag of results) {
    const feature = {
      text: "-",
      id: "arbeitsauftrag." + arbeitsauftrag.id,
      enriched,
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

  const sortedFeatures = features.sort((a, b) =>
    a.properties.nummer.localeCompare(b.properties.nummer)
  );
  //add index to features
  let index = 0;
  for (const f of sortedFeatures) {
    f.index = index++;
  }
  return sortedFeatures;
};

const geometryFactory = (arbeitsauftrag) => {
  const geoms = [];
  for (const arrayentry of arbeitsauftrag.ar_protokolleArray) {
    const prot = arrayentry.arbeitsprotokoll;
    if (prot?.geometrie?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot?.geometrie?.geom?.geo_field));
    }
    if (prot?.tdta_leuchten?.fk_standort?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot.tdta_leuchten.fk_standort.geom?.geo_field));
    }
    if (prot?.tdta_standort_mast?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot.tdta_standort_mast.geom?.geo_field));
    }
    if (prot?.schaltstelle?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot.schaltstelle.geom?.geo_field));
    }
    if (prot?.mauerlasche?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot.mauerlasche.geom?.geo_field));
    }
    if (prot?.leitung?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot.leitung.geom?.geo_field));
    }
    if (prot?.abzweigdose?.geom?.geo_field) {
      geoms.push(createGeomOnlyFeature(prot.abzweigdose.geom?.geo_field));
    }
  }
  const turfCollection = turfHelpers.featureCollection(geoms);

  const convexFeature = convex(turfCollection);
  return convexFeature.geometry;
};

const createGeomOnlyFeature = (geom) => {
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
