import { DOMAIN, REST_SERVICE } from "../../../constants/belis";

export async function fetchGraphQL(operationsDoc, variables, jwt) {
  //	const result = await fetch('http:// localhost:8890/actions/WUNDA_BLAU.graphQl/tasks?resultingInstanceType=result', {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + jwt);
  myHeaders.append("Content-Type", "application/json");
  // myHeaders.append("Content-Encoding", "gzip");

  const body = JSON.stringify({
    query: operationsDoc,
    variables: variables,
  });

  console.log("body", {
    query: operationsDoc,
    variables: variables,
  });

  try {
    const result = await fetch(REST_SERVICE + "/graphql/" + DOMAIN + "/execute", {
      method: "POST",
      headers: myHeaders,
      body,
    });
    // console.log("xxx result", result);

    return await result.json();
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
