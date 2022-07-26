import { DOMAIN, REST_SERVICE } from "../../../constants/belis";
import { getNonce } from "../../helper/featureHelper";

export async function fetchGraphQL(operationsDoc, variables, jwt) {
  //check if there is a query param with the name logGQL

  const logGQLFromSearch = new URLSearchParams(window.location.search).get("logGQL");
  const logGQLEnabled = logGQLFromSearch !== null && logGQLFromSearch !== "false";
  const nonce = getNonce();

  //	const result = await fetch('http:// localhost:8890/actions/WUNDA_BLAU.graphQl/tasks?resultingInstanceType=result', {
  let myHeaders = new Headers();

  myHeaders.append("Authorization", "Bearer " + (jwt || "unset.jwt.token"));
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
    const response = await fetch(REST_SERVICE + "/graphql/" + DOMAIN + "/execute", {
      method: "POST",
      headers: myHeaders,
      body,
    });
    if (response.status >= 200 && response.status < 300) {
      const resultjson = await response.json();
      if (logGQLEnabled) {
        console.log(`logGQL:: Result (${nonce}):`, resultjson);
      }
      return { ok: true, status: response.status, ...resultjson };
    } else {
      return {
        ok: false,
        status: response.status,
      };
    }
  } catch (e) {
    if (logGQLEnabled) {
      console.log("error in fetch", e);
    }
    throw new Error(e);
  }
}
