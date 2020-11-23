const DBVERSION = 10;

const DBNAME = 'Belis';

export const init = () => {};

export const addToIDB = async (objectStore, completedata) => {
	openDB(async (db) => {
		let i,
			j,
			chunk = 5000,
			counter = 0;
		for (i = 0, j = completedata.length; i < j; i += chunk) {
			const data = completedata.slice(i, i + chunk);

			const tx = db.transaction(objectStore, 'readwrite');
			postMessage('transaction ' + objectStore + 'tx=' + tx.store);
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
				postMessage({ progress: counter });
				counter++;
			}
		}
		postMessage({ done: true });
		// while (true) {
		// 	let primes = [];
		// 	for (let i = 0; i < iterations; i++) {
		// 		let candidate = i * (multiplier * Math.random());
		// 		let isPrime = true;

		// 		for (var c = 2; c <= Math.sqrt(candidate); ++c) {
		// 			if (candidate % c === 0) {
		// 				// not prime
		// 				isPrime = false;
		// 				break;
		// 			}
		// 		}
		// 		if (isPrime) {
		// 			primes.push(candidate);
		// 		}
		// 	}
		// 	postMessage(primes);
		// }
	});
};

const openDB = (dbaction) => {
	let req = indexedDB.open(DBNAME, DBVERSION);
	req.onupgradeneeded = function(e) {
		postMessage('upgraded needed');
		let db = e.target.result;
		createOrClearObjectStore(db, 'anlagengruppe');
		createOrClearObjectStore(db, 'arbeitsprotokollstatus');
		createOrClearObjectStore(db, 'bauart');
		createOrClearObjectStore(db, 'infobaustein');
		createOrClearObjectStore(db, 'leitungstyp');
		createOrClearObjectStore(db, 'leuchtmittel');
		createOrClearObjectStore(db, 'material_leitung');
		createOrClearObjectStore(db, 'material_mauerlasche');
		createOrClearObjectStore(db, 'querschnitt');
		createOrClearObjectStore(db, 'team');
		createOrClearObjectStore(db, 'tkey_bezirk');
		createOrClearObjectStore(db, 'tkey_doppelkommando');
		createOrClearObjectStore(db, 'tkey_energielieferant');
		createOrClearObjectStore(db, 'tkey_kennziffer');
		createOrClearObjectStore(db, 'tkey_klassifizierung');
		createOrClearObjectStore(db, 'tkey_mastart');
		createOrClearObjectStore(db, 'tkey_strassenschluessel');
		createOrClearObjectStore(db, 'tkey_unterh_leuchte');
		createOrClearObjectStore(db, 'tkey_unterh_mast');
		createOrClearObjectStore(db, 'veranlassungsart');
		createOrClearObjectStore(db, 'arbeitsprotokollaktion');
		createOrClearObjectStore(db, 'infobaustein_template');
		createOrClearObjectStore(db, 'rundsteuerempfaenger');
		createOrClearObjectStore(db, 'abzweigdose');
		createOrClearObjectStore(db, 'tkey_leuchtentyp');
		createOrClearObjectStore(db, 'tkey_masttyp');
		createOrClearObjectStore(db, 'arbeitsauftrag');
		createOrClearObjectStore(db, 'leitung');
		createOrClearObjectStore(db, 'mauerlasche');
		createOrClearObjectStore(db, 'schaltstelle');
		createOrClearObjectStore(db, 'arbeitsprotokoll');
		createOrClearObjectStore(db, 'tdta_leuchten');
		createOrClearObjectStore(db, 'veranlassung');
		createOrClearObjectStore(db, 'tdta_standort_mast');
		createOrClearObjectStore(db, 'raw_point_index');
		createOrClearObjectStore(db, 'all_tdta_standort_mast');
		postMessage('Successfully upgraded db');
	};
	req.onsuccess = function(e) {
		postMessage('success');
		let db = req.result;
		dbaction(db);
	};
	req.onerror = function(e) {
		postMessage('error');
		postMessage({ error: e });
	};
};

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

const createOrClearObjectStore = (db, storename, options = { keyPath: 'id' }) => {
	try {
		db.createObjectStore(storename, options);
	} catch (e) {
		console.log('error during createobjectstore');
	}
};
