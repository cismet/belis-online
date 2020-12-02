export async function fetchGraphQL(operationsDoc, variables) {
	const result = await fetch('https://belis-alpha-graphql-api.cismet.de/v1/graphql', {
		method: 'POST',
		body: JSON.stringify({
			query: operationsDoc,
			variables: variables
		}),
		header: myHeaders
	});

	return await result.json();
}
let myHeaders = new Headers();
myHeaders.append('pragma', 'no-cache');
myHeaders.append('cache-control', 'no-cache');
myHeaders.append('x-hasura-admin-secret', 'Xooquixac5Hae');
