import { DOMAIN, REST_SERVICE } from "../../../constants/belis";

export async function fetchGraphQL(operationsDoc, variables, jwt) {
  //check if there is a query param with the name logGQL

  const logGQLFromSearch = new URLSearchParams(window.location.search).get("logGQL");
  const logGQLEnabled = logGQLFromSearch !== null && logGQLFromSearch !== "false";
  const nonce = Math.floor(Math.random() * 1000);

  //	const result = await fetch('http:// localhost:8890/actions/WUNDA_BLAU.graphQl/tasks?resultingInstanceType=result', {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + jwt);
  myHeaders.append("Content-Type", "application/json");

  // myHeaders.append("Content-Encoding", "gzip");
  const queryObject = {
    query: operationsDoc,
    variables: variables,
  };
  const body = JSON.stringify(queryObject);
  if (logGQLEnabled) {
    console.log(`logGQL:: GraphQL query (${nonce}):`, queryObject);
  }
  try {
    const result = await fetch(REST_SERVICE + "/graphql/" + DOMAIN + "/execute", {
      method: "POST",
      headers: myHeaders,
      body,
    });
    // console.log("xxx result", result);

    const resultjson = await result.json();
    if (logGQLEnabled) {
      console.log(`logGQL:: Result (${nonce}):`, resultjson);
    }
    return resultjson;
  } catch (e) {
    console.log("error in fetch", e);
    throw new Error(e);
  }
}

// export async function fetchGraphQL(operationsDoc, variables) {
// 	const result = await fetch('htt ps://belis-alpha-graphql-api.cismet.de/v1/graphql', {
// 		method: 'POST',
// 		body: JSON.stringify({
// 			query: operationsDoc,
// 			variables: variables
// 		}),
// 		header: myHeaders
// 	});

// 	return await result.json();
// }
// let myHeaders = new Headers();
// myHeaders.append('pragma', 'no-cache');
// myHeaders.append('cache-control', 'no-cache');
// myHeaders.append('x-hasura-admin-secret', 'Xooquixac5Hae');
