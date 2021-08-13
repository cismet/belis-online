export async function fetchGraphQL(operationsDoc, variables, jwt) {
	
//	const result = await fetch('http://localhost:8890/actions/WUNDA_BLAU.graphQl/tasks?resultingInstanceType=result', {
	let myHeaders = new Headers();
	myHeaders.append('Authorization', 'Bearer ' + jwt);
	myHeaders.append('Content-Type', 'application/json');

	const result = await fetch('http://localhost:8890/graphql/WUNDA_BLAU/execute', {
		method: 'POST',
		headers: myHeaders,
		body: JSON.stringify({
			query: operationsDoc,
			variables: variables
		}),
	});

	return await result.json();
}


// export async function fetchGraphQL(operationsDoc, variables) {
// 	const result = await fetch('https://belis-alpha-graphql-api.cismet.de/v1/graphql', {
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