const DBVERSION = 12;
const DBNAME = 'Belis';
const TRANSACTIONCHUNKSIZE = 5000;
const ERRORS = {
	NOT_INITED: 0,
	CONTAINS_KEY: 1
};
let inited = false;
let db = undefined;

export const init = () => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DBNAME, DBVERSION);
		const r = Math.random();

		let upgradeneeded = false;
		request.onupgradeneeded = (event) => {
			db = event.target.result;
			upgradeneeded = true;
			createOrClearObjectStore(db, '_meta');
			createOrClearObjectStore(db, '_test');
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
		};

		request.onsuccess = (event) => {
			inited = true;
			db = request.result;
			resolve({ success: true, upgradeneeded });
		};
	});
};

export const isInited = () => {
	if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
		console.log('I am in a web worker');
	} else {
		console.log('I am NOT in a web worker');
	}
	return inited;
};

export async function putArray(inputArray, objectstorename) {
	try {
		let i,
			j,
			chunk = TRANSACTIONCHUNKSIZE,
			counter = 0;
		for (i = 0, j = inputArray.length; i < j; i += chunk) {
			const data = inputArray.slice(i, i + chunk);
			const tx = db.transaction(objectstorename, 'readwrite');
			const promises = [];
			for (const item of data) {
				// console.log('item', item);
				cleanUpObject(item);
				// console.log('after removeEmpty(item)', item);

				promises.push(putP(item, objectstorename));
			}
			promises.push(tx.done);

			const modulo = Math.floor(inputArray.length / 100);

			for (const p of promises) {
				await p;

				if (counter % modulo === 0) {
					postMessage({ progress: counter, objectstorename });
				}
				counter++;
			}
		}
		return { counter: counter - 1 };
	} catch (err) {
		console.log('worker error in add', err);
	}
}

export async function put(input, objectstorename) {
	try {
		return await putP(input, objectstorename);
	} catch (err) {
		console.log('worker error in add', err);
	}
}

function putP(input, objectstorename) {
	return new Promise((resolve, reject) => {
		if (inited === false) {
			reject({
				debugLog: 'not inited',
				error: 'not inited',
				errorCode: ERRORS.NOT_INITED
			});
			return;
		}
		const transaction = db.transaction(objectstorename, 'readwrite');
		const store = transaction.objectStore(objectstorename);
		const request = store.put(input);
		request.onsuccess = (event) => {
			resolve({ debugLog: 'write success' });
		};
		request.onerror = (event) => {
			reject({ debugLog: 'write error:', error: event.target.error });
		};
	});
}
function addP(input, objectstorename) {
	return new Promise((resolve, reject) => {
		if (inited === false) {
			reject({
				debugLog: 'not inited',
				error: 'not inited',
				errorCode: ERRORS.NOT_INITED
			});
			return;
		}
		const transaction = db.transaction(objectstorename, 'readwrite');
		const store = transaction.objectStore(objectstorename);
		const request = store.add(input);

		request.onsuccess = (event) => {
			resolve({ debugLog: 'write success' });
		};
		request.onerror = (event) => {
			reject({ debugLog: 'write error:', error: event.target.error });
		};
	});
}

export async function getCount(objectStore) {
	try {
		return await new Promise((resolve, reject) => {
			const transaction = db.transaction(objectStore, 'readonly');
			const store = transaction.objectStore(objectStore);
			const request = store.getAllKeys();
			request.onerror = function(event) {
				console.log('onerror');

				reject({ debugLog: 'get error:', error: event.target.error });
			};
			request.onsuccess = function(event) {
				console.log('onsuccess');

				if (event.target.result !== undefined) {
					resolve(event.target.result.length);
				} else {
					reject({ debugLog: 'nothing found for ' + id });
				}
			};
		});
	} catch (err) {
		console.log('worker error', err);
	}
}

export async function getAll(objectStore) {
	try {
		return await new Promise((resolve, reject) => {
			const transaction = db.transaction(objectStore, 'readonly');
			const store = transaction.objectStore(objectStore);
			const request = store.getAll();
			request.onerror = function(event) {
				console.log('onerror');

				reject({ debugLog: 'get error:', error: event.target.error });
			};
			request.onsuccess = function(event) {
				console.log('onsuccess');

				if (event.target.result !== undefined) {
					resolve(event.target.result);
				} else {
					reject({ debugLog: 'nothing found for ' + id });
				}
			};
		});
	} catch (err) {
		console.log('worker error', err);
	}
}

export async function get(id, objectStore) {
	try {
		return await new Promise((resolve, reject) => {
			if (inited === false) {
				console.log('nnn');
				reject({
					debugLog: 'not inited',
					error: 'not inited',
					errorCode: ERRORS.NOT_INITED
				});
			}
			const transaction = db.transaction(objectStore, 'readonly');
			const store = transaction.objectStore(objectStore);
			const request = store.get(id);
			request.onerror = function(event) {
				console.log('onerror');

				reject({ debugLog: 'get error:', error: event.target.error });
			};
			request.onsuccess = function(event) {
				console.log('onsuccess');

				if (event.target.result !== undefined) {
					resolve({ debugLog: 'get success', data: event.target.result });
				} else {
					reject({ debugLog: 'nothing found for ' + id });
				}
			};
		});
	} catch (err) {
		console.log('worker error', err);
	}
}

async function _template(input) {
	try {
		return await new Promise((resolve, reject) => {
			resolve({ debugLog: 'dummy answer', data: 'xxx' });
		});
	} catch (err) {
		console.log('worker error in _template', err);
	}
}

//tools

const createOrClearObjectStore = (db, storename, options = { keyPath: 'id' }) => {
	try {
		db.createObjectStore(storename, options);
	} catch (e) {
		console.log('error during createobjectstore', e);
	}
};

const cleanUpObject = (obj) => {
	Object.keys(obj).forEach((key) => {
		if (obj[key] && typeof obj[key] === 'object' && Array.isArray(obj[key]) === false) {
			cleanUpObject(obj[key]); // recurse
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

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
