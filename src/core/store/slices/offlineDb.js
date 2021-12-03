import { createSlice } from "@reduxjs/toolkit";
import * as offlineDatabase from "../../commons/offlineDbHelper";
import { getJWT, getLoginFromJWT } from "./auth";
import { integrateIntermediateResultsIntofeatureCollection } from "./featureCollection";
import uuidv4 from "uuid/v4";

const initialState = {};

const slice = createSlice({
  name: "offlineDb",
  initialState,
  reducers: {
    storeDB(state, action) {
      state.db = action.payload;
      return state;
    },
    storeIntermediateResults(state, action) {
      state.intermediateResults = action.payload;

      return state;
    },
  },
});

export default slice;

export const { storeDB, storeIntermediateResults } = slice.actions;

export const getDB = (state) => {
  return state.offlineDb.db;
};
export const getIntermediateResults = (state) => {
  return state.offlineDb.intermediateResults;
};

export const initialize = async (jwt, dispatch) => {
  const d = await offlineDatabase.createDb();

  if (d !== undefined) {
    let rep = new offlineDatabase.GraphQLReplicator(d);
    const errorCallback = (error) => {
      console.log("error occured", error);
    };
    const changeCallback = (action) => {
      console.log("change occured", action);
    };
    const login = getLoginFromJWT(jwt);
    rep.restart({ userId: login + "@belis", idToken: jwt }, errorCallback, changeCallback);
    dispatch(storeDB(d));
  } else {
    throw new Error("offline database not available", jwt);
  }
};

export const clearIntermediateResults = (object_type) => {
  return async (dispatch, getState) => {
    const stateIntermediateResults = getIntermediateResults(getState()) || {};
    let intermediateResultsCopy;
    if (stateIntermediateResults[object_type]) {
      if (!intermediateResultsCopy) {
        intermediateResultsCopy = JSON.parse(JSON.stringify(stateIntermediateResults));
      }
      delete intermediateResultsCopy[object_type];
    }
    if (intermediateResultsCopy) {
      dispatch(storeIntermediateResults(intermediateResultsCopy));
    }
  };
};

export const removeIntermediateResults = (intermediateResultsToRemove) => {
  return async (dispatch, getState) => {
    const stateIntermediateResults = getIntermediateResults(getState()) || {};
    let intermediateResultsCopy;
    for (const intermediateResult of intermediateResultsToRemove) {
      const { object_type, object_id } = intermediateResult;
      if (
        stateIntermediateResults[object_type] &&
        stateIntermediateResults[object_type][object_id]
      ) {
        if (!intermediateResultsCopy) {
          intermediateResultsCopy = JSON.parse(JSON.stringify(stateIntermediateResults));
        }
        delete intermediateResultsCopy[object_type][object_id];
      }
    }
    if (intermediateResultsCopy) {
      dispatch(storeIntermediateResults(intermediateResultsCopy));
    }
  };
};
const addIntermediateResult = (intermediateResult) => {
  return async (dispatch, getState) => {
    // intermediate result has the following attributes
    // object_typ: class of the object
    // object_id: primary key of the object
    // data: the object itself (JSON)
    // in data for example in the add image action:
    //      imageData: the image data
    //      description: the description of the image
    //      ending: the ending of the image
    //      prefix: the prefix of the image
    //      ts: the timestamp of the image
    const stateIntermediateResults = getIntermediateResults(getState()) || {};
    console.log("intermediateResult", intermediateResult);

    const intermediateResults = JSON.parse(JSON.stringify(stateIntermediateResults));

    if (!intermediateResults[intermediateResult.object_type]) {
      intermediateResults[intermediateResult.object_type] = {};
    }
    if (!intermediateResults[intermediateResult.object_type][intermediateResult.object_id]) {
      intermediateResults[intermediateResult.object_type][intermediateResult.object_id] = {};
    }
    if (
      !intermediateResults[intermediateResult.object_type][intermediateResult.object_id][
        intermediateResult.resultType
      ]
    ) {
      intermediateResults[intermediateResult.object_type][intermediateResult.object_id][
        intermediateResult.resultType
      ] = [];
    }
    intermediateResults[intermediateResult.object_type][intermediateResult.object_id][
      intermediateResult.resultType
    ].push(intermediateResult.data);
    if (intermediateResults["schaltstelle"] && intermediateResults["schaltstelle"][1444]) {
      console.log("store intermediateResults", intermediateResults);
      console.log(
        "count intermediateResults of schaltstelle-1444",
        intermediateResults["schaltstelle"][1444].image.length
      );
    }
    dispatch(storeIntermediateResults(intermediateResults));
    dispatch(integrateIntermediateResultsIntofeatureCollection(intermediateResults));
  };
};

export const processAddImageToObject = (addImageParameter) => {
  return async (dispatch, getState) => {
    const state = getState();
    const offlineDb = getDB(state);
    const jwt = getJWT(state);
    const login = getLoginFromJWT(jwt);
    offlineDb.actions.insert({
      id: uuidv4(),
      action: "uploadDocument",
      jwt: jwt,
      parameter: JSON.stringify(addImageParameter),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationId: login + "@belis",
    });

    console.log("added object to offline db to uploadDocument", addImageParameter);

    const intermediateResult = {
      object_type: addImageParameter.objekt_typ,
      object_id: addImageParameter.objekt_id,
      data: {
        imageData: addImageParameter.ImageData,
        ending: addImageParameter.ending,
        prefix: addImageParameter.prefix,
        description: addImageParameter.description,
      },
      ts: addImageParameter.ts,
      action: "uploadDocument",
      resultType: "image",
    };

    //add parameterInfo to intermediateResults
    dispatch(addIntermediateResult(intermediateResult));
  };
};

export const uploadDocumemt = () => {};
