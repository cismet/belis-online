import uuidv4 from "uuid/v4";

import { getJWT, getLoginFromJWT } from "../auth";
import { addIntermediateResult, getDB } from "../offlineActionDb";

const protocolAction = (params) => {
  return async (dispatch, getState) => {
    const state = getState();
    const offlineActionDb = getDB(state);
    const jwt = getJWT(state);
    const login = getLoginFromJWT(jwt);

    const offlineAction = {
      id: uuidv4(),
      action: params.actionname,
      jwt: jwt,
      parameter: JSON.stringify(params),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationId: login + "@belis",
    };

    offlineActionDb.actions.insert(offlineAction);

    console.log("added object to offline db to addIncident", params, offlineAction);
    let intermediateResult = {
      object_type: "arbeitsprotokoll",
      object_id: params.protokoll_id,
      data: {
        ...params,
      },
      ts: params.ts,
      action: params.actionname,
      resultType: "object",
    };
    dispatch(addIntermediateResult(intermediateResult));
  };
};

export default protocolAction;
