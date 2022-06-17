import uuidv4 from "uuid/v4";

import { getJWT, getLoginFromJWT } from "../auth";
import { getDB } from "../offlineActionDb";

const addIncidentAction = (params) => {
  return async (dispatch, getState) => {
    const state = getState();
    const offlineActionDb = getDB(state);
    const jwt = getJWT(state);
    const login = getLoginFromJWT(jwt);

    const offlineAction = {
      id: uuidv4(),
      action: "addIncident",
      jwt: jwt,
      parameter: JSON.stringify(params),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationId: login + "@belis",
    };

    offlineActionDb.actions.insert(offlineAction);

    console.log("added object to offline db to addIncident", params, offlineAction);

    // const intermediateResult = {
    //   object_type: addImageParameter.objekt_typ,
    //   object_id: addImageParameter.objekt_id,
    //   data: {
    //     imageData: addImageParameter.ImageData,
    //     ending: addImageParameter.ending,
    //     prefix: addImageParameter.prefix,
    //     description: addImageParameter.description,
    //   },
    //   ts: addImageParameter.ts,
    //   action: "uploadDocument",
    //   resultType: "image",
    // };

    // //add parameterInfo to intermediateResults
    // dispatch(addIntermediateResult(intermediateResult));
  };
};

export default addIncidentAction;
