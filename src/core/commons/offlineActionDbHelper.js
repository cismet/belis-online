import RxDBReplicationGraphQL from "rxdb/plugins/replication-graphql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import RxDB from "rxdb";
import { actionSchema } from "./schema";
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check";
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages";
import RxDBValidateModule from "rxdb/plugins/validate";
import { isArray } from "lodash";

RxDB.plugin(RxDBSchemaCheckModule);
RxDB.plugin(RxDBErrorMessagesModule);
RxDB.plugin(RxDBValidateModule);
RxDB.plugin(RxDBReplicationGraphQL);
RxDB.plugin(require("pouchdb-adapter-idb"));

const completedIds = {};
const syncURL = "https://offline-actions.cismet.de/v1/graphql";
export const ERR_CODE_INVALID_JWT = "invalid-jwt";
export const ERR_CODE_NO_CONNECTION = "Failed to fetch";
const ERR_MSG_INVALID_JWT = "Could not verify JWT";

const batchSize = 5;
const pullQueryBuilder = (userId) => {
  return (doc) => {
    if (!doc) {
      doc = {
        id: "",
        updatedAt: new Date(0).toUTCString(),
      };
    }

    const query = `{
            action(
                where: {
                    _and: [
                        {updatedAt: {_gt: "${doc.updatedAt}"}},
                        {applicationId: {_eq: "${userId}"}}
                    ]
                },
                limit: ${batchSize},
                order_by: [{updatedAt: asc}, {id: asc}]
            ) {
                id
                jwt
                isCompleted
                applicationId
                createdAt
                updatedAt
                action,
                parameter,
                result,
                status
            }
        }`;
    return {
      query,
      variables: {},
    };
  };
};

const pushQueryBuilder = (doc) => {
  const query = `
        mutation InsertAction($action: [action_insert_input!]!) {
            insert_action(
                objects: $action,
                on_conflict: {
                    constraint: action_pkey,
                    update_columns: [jwt, applicationId, isCompleted, action, parameter, result, updatedAt]
                }){
                returning {
                  id
                }
            }
        }
     `;
  const variables = {
    action: doc,
  };

  const operationName = "InsertAction";

  return {
    query,
    variables,
    operationName,
  };
};

export class GraphQLReplicator {
  constructor(db) {
    this.db = db;
    this.replicationState = null;
    this.subscriptionClient = null;
  }

  async restart(auth, errorCallback, updateCallback) {
    if (this.replicationState) {
      this.replicationState.cancel();
    }

    if (this.subscriptionClient) {
      this.subscriptionClient.close();
    }

    this.replicationState = await this.setupGraphQLReplication(auth, errorCallback);
    this.subscriptionClient = this.setupGraphQLSubscription(
      auth,
      this.replicationState,
      updateCallback,
      errorCallback
    );
  }

  errorHandling(err, callback) {
    let errorCode = null;

    if (err.message) {
      if (err.message instanceof String) {
        let msg = JSON.parse(err.message);

        if (Array.isArray(msg)) {
          errorCode = msg[0].extensions.code;
        }
      } else {
        errorCode = err.message;
      }
    }

    if (errorCode === null) {
      errorCode = err;
    }

    console.debug("error code:" + errorCode);

    if (errorCode.indexOf(ERR_MSG_INVALID_JWT) !== -1 || errorCode === ERR_CODE_INVALID_JWT) {
      if (callback) {
        callback(ERR_CODE_INVALID_JWT);
      }
    } else if (errorCode === ERR_CODE_NO_CONNECTION) {
      if (callback) {
        callback(ERR_CODE_NO_CONNECTION);
      }
    }
  }

  async setupGraphQLReplication(auth, errorCallback) {
    const replicationState = this.db.actions.syncGraphQL({
      url: syncURL,
      headers: {
        Authorization: `Bearer ${auth.idToken}`,
      },
      push: {
        batchSize,
        queryBuilder: pushQueryBuilder,
      },
      pull: {
        queryBuilder: pullQueryBuilder(auth.userId),
      },
      live: true,
      /**
       * Because the websocket is used to inform the client
       * when something has changed,
       * we can set the liveIntervall to a high value
       */
      liveInterval: 1000 * 60 * 10, // 10 minutes
      deletedFlag: "deleted",
      retryTime: 60000,
    });

    replicationState.error$.subscribe((err) => {
      this.errorHandling(err, errorCallback);
      replicationState.cancel();
    });

    return replicationState;
  }

  setupGraphQLSubscription(auth, replicationState, updateCallback, errorCallback) {
    // Change this url to point to your hasura graphql url
    const endpointURL = "wss://offline-actions.cismet.de/v1/graphql";
    const wsClient = new SubscriptionClient(endpointURL, {
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: `Bearer ${auth.idToken}`,
        },
      },
      timeout: 1000 * 60,
      onConnect: (msg) => {
        console.log("SubscriptionClient.onConnect()");
      },
      connectionCallback: (err) => {
        if (err) {
          if (err === "Could not verify JWT: JWSError JWSInvalidSignature") {
            console.log("cannot verify jwt");
            if (errorCallback) {
              errorCallback(ERR_CODE_INVALID_JWT);
            }
          }
        }
      },
      reconnectionAttempts: 1,
      inactivityTimeout: 0,
      lazy: true,
    });

    const query = `subscription onActionChanged {
            action ( where: {_and: {applicationId: {_eq: "${auth.userId}"}, isCompleted: {_eq: false}}}){
                id
                jwt
                isCompleted
                applicationId
                createdAt
                updatedAt
                action,
                parameter,
                result,
                status
            }       
        }`;

    const ret = wsClient.request({ query });
    const errorHandler = this.errorHandling;
    const d = this.db;

    ret.subscribe({
      next(data) {
        console.log("subscription emitted => trigger run");

        for (const action of data.data.action) {
          if (action.status === 401) {
            //wrong jwt was set
            d.actions.find({ id: action.id }).$.subscribe((act) => {
              if (act && isArray(act) && act.length > 0 && act[0].status === 401) {
                const changeFunction = (oldData) => {
                  oldData.jwt = auth.idToken;
                  // when a value is null, the rxdb will throw an error
                  oldData.result = undefined;
                  oldData.status = undefined;
                  return oldData;
                };
                //set the current jwt
                act[0].atomicUpdate(changeFunction);
              }
            });
          } else if (action.result !== null && action.isCompleted === false) {
            d.actions.find({ id: action.id }).$.subscribe((act) => {
              if (act && isArray(act) && act.length > 0 && !act[0].isCompleted) {
                const changeFunction = (oldData) => {
                  oldData.isCompleted = true;
                  // when a value is null, the rxdb will throw an error
                  if (oldData.result === null) {
                    oldData.result = undefined;
                  }
                  if (oldData.status === null) {
                    oldData.status = undefined;
                  }
                  return oldData;
                };
                //set isCompelted to true
                act[0].atomicUpdate(changeFunction);
                //call the callback function
                if (updateCallback != null && completedIds[action.id] === undefined) {
                  completedIds[action.id] = true;
                  updateCallback(action);
                }
              }
            });
          }
        }
        replicationState.run();
      },
      error(error) {
        errorHandler(error, errorCallback);
      },
    });

    return wsClient;
  }
}

export const createDb = async () => {
  console.log("DatabaseService: creating database..");
  if (window["dbInit"]) {
    return window["db"];
  }
  window["dbInit"] = true;

  const db = await RxDB.create({
    name: "actiondb",
    adapter: "idb",
  });

  console.log("DatabaseService: created database");
  window["db"] = db; // write to window for debugging

  await db.collection({
    name: "actions",
    schema: actionSchema,
  });

  return db;
};
