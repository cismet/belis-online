import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import queries from '../core/indexeddb/queries';
import { dbPromise } from '../core/indexeddb/db';
import { useWindowSize } from '@react-hook/window-size';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import {
	faBookOpen,
	faSearch,
	faGlobeEurope,
	faBars,
	faTimes,
	faSpinner,
	faQuestionCircle,
	faDatabase,
	faCheckSquare
} from '@fortawesome/free-solid-svg-icons';
import dexieworker from 'workerize-loader!../core/workers/dexie'; // eslint-disable-line import/no-webpack-loader-syntax
const dexieW = dexieworker();

async function fetchGraphQL(operationsDoc, variables) {
	// console.log('fetchGraphQL', operationsDoc);

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

const getIconForLoadingState = (ls) => {
	if (ls === 'loading') {
		return <Icon spin icon={faSpinner} />;
	} else if (ls === 'caching') {
		return <Icon spin icon={faDatabase} />;
	} else if (ls === 'cached') {
		return <Icon icon={faCheckSquare} />;
	} else {
		return <Icon icon={faQuestionCircle} />;
	}
};

const Loader = ({ loaderInfo }) => {
	const itemKey = loaderInfo.queryKey;
	const dataKey = loaderInfo.dataKey || loaderInfo.queryKey;

	useEffect(
		() => {
			setLoadingState('loading');
			dexieW.addEventListener('message', (message) => {
				if (
					message.data.progress !== undefined &&
					message.data.objectstorename === itemKey
				) {
					setNumber(message.data.progress);
				}
			});
			// löschen nicht nötig, da put gemacht wird
			// dbPromise.then((db) => {
			// 	db.clear(itemKey);
			// });
			fetchGraphQL(queries[itemKey], {})
				.then((result, error) => {
					if (error !== undefined) {
						console.log('error in fetch ', error);
					} else {
						console.log(
							itemKey + ' returned with ' + result.data[dataKey].length + ' results'
						);

						setLoadingState('caching');
						setMax(result.data[dataKey].length);

						(async () => {
							//await dexieW.init(dataKey);
							const y = await dexieW.putArray(result.data[dataKey], itemKey);
							console.log(dataKey + ' done', y);
							setLoadingState('cached');
						})();
					}
				})
				.catch(function(error) {
					console.log('error in fetch ', error);
				});
		},
		[ itemKey, dataKey ]
	);

	const [ loadingState, setLoadingState ] = useState(undefined);
	const [ startTime ] = useState(new Date().getTime());

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
		return (
			<tr>
				<td>---</td>
			</tr>
		);
	} else if (loadingState === 'loading') {
		return (
			<tr>
				<td>{getIconForLoadingState(loadingState)}</td>
				<td>Loading {itemKey}:</td>
				<td>...</td>
			</tr>
		);
	} else if (loadingState === 'caching') {
		return (
			<tr>
				<td>{getIconForLoadingState(loadingState)}</td>
				<td>
					Caching {itemKey} ({max}):
				</td>
				<td style={{ width: '300px' }}>
					<ProgressBar animated now={number} label={number} max={max} />
				</td>
			</tr>
		);
	} else if (loadingState === 'cached') {
		return (
			<tr>
				<td>{getIconForLoadingState(loadingState)}</td>
				<td>
					Cached {itemKey} ({max}):
				</td>
				<td style={{ width: '300px' }}>
					<ProgressBar
						variant='success'
						now={max}
						max={max}
						label={Math.round(new Date().getTime() - startTime) / 1000 + 's'}
					/>
				</td>
			</tr>
		);
	} else {
		return (
			<tr>
				<td />
			</tr>
		);
	}
};

export default Loader;
