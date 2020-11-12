import React, { useEffect, useState } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache, useQuery, gql } from '@apollo/client';

import queries from '../core/indexeddb/queries';
import { dbPromise } from '../core/indexeddb/db';

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchGraphQL(operationsDoc, variables) {
	const result = await fetch('http://192.168.178.66:8090/v1/graphql', {
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

const removeEmpty = (obj) => {
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object' && Array.isArray(obj[key]) === false) {
			removeEmpty(obj[key]); // recurse
		} else if (
			obj[key] &&
			typeof obj[key] === 'object' &&
			Array.isArray(obj[key]) === true &&
			obj[key].length === 0
		) {
			delete obj[key]; // delete
		} else if (obj[key] == null) {
			delete obj[key]; // delete
		}
	});
};

async function addToIDB(dbPromise, objectStore, data, setProgress) {
	const db = await dbPromise;
	const tx = db.transaction(objectStore, 'readwrite');
	const promises = [];
	for (const item of data) {
		console.log('item', item);
		removeEmpty(item);
		console.log('after removeEmpty(item)', item);

		promises.push(tx.store.put(item));
	}
	promises.push(tx.done);

	let i = 0;
	for (const p of promises) {
		await p;
		setProgress(i);
		i++;
	}
}

const Loader = ({ itemKey }) => {
	useEffect(
		() => {
			setLoadingState('loading');
			// löschen nicht nötig, da put gemacht wird
			// dbPromise.then((db) => {
			// 	db.clear(itemKey);
			// });
			fetchGraphQL(queries[itemKey], {}).then((result) => {
				console.log(itemKey + ' returned with ' + result.data[itemKey].length + ' results');

				setLoadingState('caching');
				setMax(result.data[itemKey].length);

				addToIDB(dbPromise, itemKey, result.data[itemKey], setNumber).then(() => {
					console.log('XXXX done');
					setLoadingState('cached');
				});
			});
		},
		[ itemKey ]
	);

	const [ loadingState, setLoadingState ] = useState(undefined);
	const [ max, setMax ] = useState(0);
	const [ number, setNumber ] = useState(0);

	// const result = useQuery(query);
	// const { loading, error, data } = result;

	// console.log(title, { loading, error, data });
	// console.log('loadingState(' + itemKey + ')', loadingState);
	// console.log(
	// 	'performance.memory.usedJSHeapSize:' + performance.memory.usedJSHeapSize / 1024 / 1024 + ','
	// );

	// console.log('number.loadingState', number, loadingState);

	if (loadingState === undefined) {
		return <div>---</div>;
	} else if (loadingState === 'loading') {
		return (
			<div>
				{' '}
				{loadingState} Loading {itemKey}...
			</div>
		);
	} else if (loadingState === 'caching') {
		return (
			<div>
				{loadingState}
				Caching {itemKey}...<progress value={number} max={max}>
					{max}
				</progress>
			</div>
		);
	} else if (loadingState === 'cached') {
		return (
			<div>
				{loadingState}
				Cached {itemKey}: {max}{' '}
			</div>
		);
	} else {
		return <div>???</div>;
	}
};

const Pr = ({ delay = 1000, start = 0, max = 100 }) => {
	const [ number, setNumber ] = useState(start);
	useEffect(() => {
		for (let i = start; i < max; ++i) {
			setTimeout(() => {
				setNumber(i + 1);
			}, delay * i);
		}
	}, []);
	return (
		<progress value={number} max={max}>
			{max}
		</progress>
	);
};

const View = () => {
	return (
		<div>
			<Loader itemKey='anlagengruppe' />
			<Loader itemKey='arbeitsprotokollstatus' />
			<Loader itemKey='bauart' />
			{/* <Loader itemKey='infobaustein' /> */}
			<Loader itemKey='leitungstyp' />
			<Loader itemKey='leuchtmittel' />
			<Loader itemKey='material_leitung' />
			<Loader itemKey='material_mauerlasche' />
			<Loader itemKey='querschnitt' />
			<Loader itemKey='team' />
			<Loader itemKey='tkey_bezirk' />
			<Loader itemKey='tkey_doppelkommando' />
			<Loader itemKey='tkey_energielieferant' />
			<Loader itemKey='tkey_kennziffer' />
			<Loader itemKey='tkey_klassifizierung' />
			<Loader itemKey='tkey_mastart' />
			<Loader itemKey='tkey_strassenschluessel' />
			<Loader itemKey='tkey_unterh_leuchte' />
			<Loader itemKey='tkey_unterh_mast' />
			<Loader itemKey='veranlassungsart' />
			{/* <Loader itemKey='arbeitsprotokollaktion' /> */}
			{/* <Loader itemKey='infobaustein_template' /> */}
			<Loader itemKey='rundsteuerempfaenger' />
			<Loader itemKey='abzweigdose' />
			<Loader itemKey='tkey_leuchtentyp' />
			<Loader itemKey='tkey_masttyp' />
			{/* <Loader itemKey='arbeitsauftrag' /> */}
			<Loader itemKey='leitung' />
			<Loader itemKey='mauerlasche' />
			<Loader itemKey='schaltstelle' />
			{/* <Loader itemKey='arbeitsprotokoll' /> */}
			<Loader itemKey='tdta_leuchten' />
			{/* <Loader itemKey='veranlassung' /> */}
			<Loader itemKey='tdta_standort_mast' />
		</div>
		// <div>
		// 	<Loader itemKey='tkey_leuchtentyp' />
		// 	<Loader itemKey='tkey_masttyp' />
		// 	{/* <Loader itemKey='leitung' /> */}
		// </div>
	);
};
export default View;
