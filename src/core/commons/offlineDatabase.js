import RxDBReplicationGraphQL from 'rxdb/plugins/replication-graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import RxDB from 'rxdb';
import { actionSchema } from './schema';
import RxDBSchemaCheckModule from 'rxdb/plugins/schema-check';
import RxDBErrorMessagesModule from 'rxdb/plugins/error-messages';
import RxDBValidateModule from 'rxdb/plugins/validate';


RxDB.plugin(RxDBSchemaCheckModule);
RxDB.plugin(RxDBErrorMessagesModule);
RxDB.plugin(RxDBValidateModule);
RxDB.plugin(RxDBReplicationGraphQL);
RxDB.plugin(require('pouchdb-adapter-idb'));

//const syncURL = 'http://localhost:8190/v1/graphql'
const syncURL = 'https://offline-actions.cismet.de/v1/graphql'

const batchSize = 5;
const pullQueryBuilder = (userId) => {
    return (doc) => {
        if (!doc) {
            doc = {
                id: '',
                updatedAt: new Date(0).toUTCString()
            };
        }

        const query = `{
            action(
                where: {
                    _or: [
                        {updatedAt: {_gt: "${doc.updatedAt}"}},
                        {
                            updatedAt: {_eq: "${doc.updatedAt}"},
                            id: {_gt: "${doc.id}"}
                        }
                    ],
                    applicationId: {_eq: "${userId}"} 
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
            variables: {}
        };
    };
};

const pushQueryBuilder = doc => {
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
        action: doc
    };

    const operationName = "InsertAction";

    return {
        query,
        variables,
        operationName
    };
};

export class GraphQLReplicator {
    constructor(db) {
        this.db = db;
        this.replicationState = null;
        this.subscriptionClient = null;      
    }

    async restart(auth) {
        if(this.replicationState) {
            this.replicationState.cancel()
        }

        if(this.subscriptionClient) {
            this.subscriptionClient.close()
        }

        this.replicationState = await this.setupGraphQLReplication(auth)
        this.subscriptionClient = this.setupGraphQLSubscription(auth, this.replicationState)
    }

    async setupGraphQLReplication(auth) {
        const replicationState = this.db.actions.syncGraphQL({
           url: syncURL,
           headers: {
                'Authorization': `Bearer ${auth.idToken}`
           },
           push: {
               batchSize,
               queryBuilder: pushQueryBuilder
           },
           pull: {
               queryBuilder: pullQueryBuilder(auth.userId)
           },
           live: true,
           /**
            * Because the websocket is used to inform the client
            * when something has changed,
            * we can set the liveIntervall to a high value
            */
           liveInterval: 1000 * 60 * 10, // 10 minutes
           deletedFlag: 'deleted'
       });
   
       replicationState.error$.subscribe(err => {
           console.error('replication error:');
           console.dir(err);
       });

       return replicationState;
    }
   
    setupGraphQLSubscription(auth, replicationState) {
        // Change this url to point to your hasura graphql url
//        const endpointURL = 'ws://localhost:8190/v1/graphql'
        const endpointURL = 'wss://offline-actions.cismet.de/v1/graphql'
        const wsClient = new SubscriptionClient(endpointURL, {
            reconnect: true,
            connectionParams: {
                headers: {
                    'Authorization': `Bearer ${auth.idToken}`
                }
            },
            timeout: 1000 * 60,
            onConnect: () => {
                console.log('SubscriptionClient.onConnect()');
            },
            connectionCallback: () => {
                console.log('SubscriptionClient.connectionCallback:');
            },
            reconnectionAttempts: 10000,
            inactivityTimeout: 10 * 1000,
            lazy: true
        });
    
        const query = `subscription onActionChanged {
            action {
                id
                jwt
                isCompleted
                applicationId
                createdAt
                updatedAt
                action,
                parameter,
                result
            }       
        }`;
    
        const ret = wsClient.request({ query });
    
        ret.subscribe({
            next(data) {
                console.log('subscription emitted => trigger run');
                console.dir(data);
                replicationState.run();
            },
            error(error) {
                console.log('got error:');
                console.dir(error);
            }
        });
    
        return wsClient
    }    
}

export const createDb = async () => {
    console.log('DatabaseService: creating database..');

    const db = await RxDB.create({
        name: 'actiondb',
        adapter: 'idb',
    });

    console.log('DatabaseService: created database');
    window['db'] = db; // write to window for debugging

    await db.collection({
        name: 'actions',
        schema: actionSchema
     })

    return db;
};