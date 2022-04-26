import { createSlice } from "@reduxjs/toolkit";
import * as offlineDatabase from "../../commons/offlineActionDbHelper";
import { getJWT, getLoginFromJWT } from "./auth";
import { integrateIntermediateResultsIntofeatureCollection, setDone } from "./featureCollection";
import uuidv4 from "uuid/v4";
import { getTaskForAction } from "../../commons/taskHelper";

const initialState = { tasks: [], rawTasks: [] };

const slice = createSlice({
  name: "offlineActionDb",
  initialState,
  reducers: {
    storeDB(state, action) {
      state.db = action.payload;
      return state;
    },
    storeRep(state, action) {
      state.rep = action.payload;
      return state;
    },
    storeIntermediateResults(state, action) {
      state.intermediateResults = action.payload;

      return state;
    },
    setTasks(state, action) {
      state.tasks = action.payload;
      return state;
    },
    setRawTasks(state, action) {
      state.rawTasks = action.payload;
      return state;
    },
  },
});

export default slice;

export const { storeDB, storeIntermediateResults, storeRep } = slice.actions;

export const getDB = (state) => {
  return state.offlineActionDb.db;
};
export const getRep = (state) => {
  return state.offlineActionDb.rep;
};
export const getIntermediateResults = (state) => {
  return state.offlineActionDb.intermediateResults;
};

export const getTasks = (state) => {
  return state.offlineActionDb.tasks;
};
export const getRawTasks = (state) => {
  return state.offlineActionDb.rawTasks;
};
export const initialize = () => {
  return async (dispatch, getState) => {
    offlineDatabase
      .createDb()
      .then((d) => {
        const jwt = getJWT(getState());
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
          dispatch(storeRep(rep));
          dispatch(storeDB(d));

          //database is ready will now establish a subsription for all stored tasks in the offline db

          const query = d.actions
            .find()
            .where("applicationId")
            .eq(login + "@belis")
            .sort({ createdAt: "desc" });
          query.$.subscribe((results) => {
            const tasks = [];
            for (const result of results) {
              const task = getTaskForAction(result);
              tasks.push(task);
            }
            dispatch(slice.actions.setTasks(tasks));
            dispatch(slice.actions.setRawTasks(results));
          });
        } else {
          throw new Error("offline database not available", jwt);
        }
      })
      .catch((e) => {
        throw new Error("offline database not available", e);
      });
  };
};

export const truncateActionTables = () => {
  return async (dispatch, getState) => {
    const state = getState();
    console.log("start trunc");
    const db = getDB(state);

    if (db && db.actions) {
      dispatch(setDone(false));
      db.actions.remove();

      db.destroy().then((res) => {
        console.log("destroyed db" + res);
        window["dbInit"] = undefined;
        dispatch(initialize());
        dispatch(setDone(true));
      });
    }
  };
};

export const resyncDb = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const rep = getRep(state);

    if (rep) {
      const jwt = getJWT(getState());

      const errorCallback = (error) => {
        console.log("error occured", error);
      };
      const changeCallback = (action) => {
        console.log("change occured", action);
      };

      const login = getLoginFromJWT(jwt);
      rep.restart({ userId: login + "@belis", idToken: jwt }, errorCallback, changeCallback);
    }
  };
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
    const offlineActionDb = getDB(state);
    const jwt = getJWT(state);
    const login = getLoginFromJWT(jwt);
    offlineActionDb.actions.insert({
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