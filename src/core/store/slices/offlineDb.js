import { createSlice } from "@reduxjs/toolkit";
import * as offlineDatabase from "../../commons/offlineDbHelper";
import { getJWT, getLoginFromJWT } from "./auth";
import uuidv4 from "uuid/v4";

const LOCALSTORAGE_KEY = "@belis.app.offlineDB";
const initialState = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};

const slice = createSlice({
  name: "offlineDb",
  initialState,
  reducers: {
    storeDB(state, action) {
      state.db = action.payload;
      // localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
      return state;
    },
    storeIntermediateResults(state, action) {
      state.intermediateResults = action.payload;
      localStorage.setItem(
        LOCALSTORAGE_KEY,
        JSON.stringify({ intermediateResults: state.intermediateResults })
      );
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
    console.log("store intermediateResults", intermediateResults);

    dispatch(storeIntermediateResults(intermediateResults));
  };
};

export const processAddImageToObject = (addImageParameter) => {
  return async (dispatch, getState) => {
    const state = getState();
    const offlineDb = getDB(state);
    const jwt = getJWT(state);
    const login = getLoginFromJWT(jwt);
    // offlineDb.actions.insert({
    //   id: uuidv4(),
    //   action: "uploadDocument",
    //   jwt: jwt,
    //   parameter: JSON.stringify(addImageParameter),
    //   isCompleted: false,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   applicationId: login + "@belis",
    // });

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
