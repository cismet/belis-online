import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchGraphQL(operationsDoc, variables) {
	console.log('fetchGraphQL', operationsDoc);

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

async function addToIDB(dbPromise, objectStore, completedata, setProgress) {
	let i,
		j,
		chunk = 1000,
		counter = 0;
	for (i = 0, j = completedata.length; i < j; i += chunk) {
		const data = completedata.slice(i, i + chunk);
		const db = await dbPromise;
		const tx = db.transaction(objectStore, 'readwrite');
		const promises = [];
		for (const item of data) {
			// console.log('item', item);
			removeEmpty(item);
			// console.log('after removeEmpty(item)', item);

			promises.push(tx.store.put(item));
		}
		promises.push(tx.done);

		for (const p of promises) {
			await p;
			setProgress(counter);
			counter++;
		}
	}
}

const Loader = ({ loaderInfo }) => {
	const itemKey = loaderInfo.queryKey;
	const dataKey = loaderInfo.dataKey || loaderInfo.queryKey;
	useEffect(
		() => {
			setLoadingState('loading');
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

						addToIDB(dbPromise, itemKey, result.data[dataKey], setNumber).then(() => {
							console.log('XXXX done');
							setLoadingState('cached');
						});
					}
				})
				.catch(function(error) {
					console.log('error in fetch ', error);
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
		return (
			<tr>
				<td>---</td>
			</tr>
		);
	} else if (loadingState === 'loading') {
		return (
			<tr>
				<td>{getIconForLoadingState(loadingState)}</td>
				<td>Loading {itemKey}</td>
				<td>...</td>
			</tr>
		);
	} else if (loadingState === 'caching') {
		return (
			<tr key={itemKey + '.' + number}>
				<td>{getIconForLoadingState(loadingState)}</td>
				<td>Caching {itemKey}</td>
				<td>
					<progress value={number} max={max}>
						{max}
					</progress>
				</td>
			</tr>
		);
	} else if (loadingState === 'cached') {
		return (
			<tr>
				<td>{getIconForLoadingState(loadingState)}</td>
				<td>Cached {itemKey}</td>
				<td>{max}</td>
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

const CacheSettings = ({ hide = () => {} }) => {
	const [ width, height ] = useWindowSize();

	const modalBodyStyle = {
		zIndex: 3000000000,

		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: height - 250,
		width: '80%'
	};

	const keys = [];
	keys.push({ queryKey: 'all_tdta_standort_mast', dataKey: 'tdta_standort_mast' });
	keys.push({ queryKey: 'tdta_standort_mast' });
	keys.push({ queryKey: 'raw_point_index' });
	keys.push({ queryKey: 'leitung' });
	keys.push({ queryKey: 'mauerlasche' });
	keys.push({ queryKey: 'schaltstelle' });
	keys.push({ queryKey: 'tdta_leuchten' });
	keys.push({ queryKey: 'anlagengruppe' });
	keys.push({ queryKey: 'arbeitsprotokollstatus' });
	keys.push({ queryKey: 'bauart' });
	// keys.push({ queryKey: 'infobaustein' });
	keys.push({ queryKey: 'leitungstyp' });
	keys.push({ queryKey: 'leuchtmittel' });
	keys.push({ queryKey: 'material_leitung' });
	keys.push({ queryKey: 'material_mauerlasche' });
	keys.push({ queryKey: 'querschnitt' });
	keys.push({ queryKey: 'team' });
	keys.push({ queryKey: 'tkey_bezirk' });
	keys.push({ queryKey: 'tkey_doppelkommando' });
	keys.push({ queryKey: 'tkey_energielieferant' });
	keys.push({ queryKey: 'tkey_kennziffer' });
	keys.push({ queryKey: 'tkey_klassifizierung' });
	keys.push({ queryKey: 'tkey_mastart' });
	keys.push({ queryKey: 'tkey_strassenschluessel' });
	keys.push({ queryKey: 'tkey_unterh_leuchte' });
	keys.push({ queryKey: 'tkey_unterh_mast' });
	keys.push({ queryKey: 'veranlassungsart' });
	// keys.push({ queryKey: 'arbeitsprotokollaktion' });
	// keys.push({ queryKey: 'infobaustein_template' });
	keys.push({ queryKey: 'rundsteuerempfaenger' });
	keys.push({ queryKey: 'abzweigdose' });
	keys.push({ queryKey: 'tkey_leuchtentyp' });
	keys.push({ queryKey: 'tkey_masttyp' });
	// keys.push({ queryKey: 'arbeitsauftrag' });
	// keys.push({ queryKey: 'arbeitsprotokoll' });
	// keys.push({ queryKey: 'veranlassung' });

	return (
		<Modal
			dialogClassName='modal-lg modal-dialog' //but why???
			bsSize='large'
			height='100%'
			style={{ height: '100%' }}
			show
			onHide={hide}
		>
			<Modal.Header>
				<Modal.Title>
					<h5>Cache Einstellungen</h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body style={modalBodyStyle} id='myMenu'>
				<div style={{ marginBottom: 5 }}>
					<table
						style={{
							width: '100%'
						}}
					>
						<tbody>
							{keys.map((item, index) => {
								return <Loader key={'loader' + index} loaderInfo={item} />;
							})}
						</tbody>
					</table>
				</div>
			</Modal.Body>
			<Modal.Footer>
				{/* <Button
					id='cmdCloseModalApplicationMenu'
					bsStyle='primary'
					type='submit'
					onClick={() => {}}
				>
					Cache füllen
				</Button> */}
				<Button
					id='cmdCloseModalApplicationMenu'
					bsStyle='primary'
					type='submit'
					onClick={hide}
				>
					Schließen
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default CacheSettings;
