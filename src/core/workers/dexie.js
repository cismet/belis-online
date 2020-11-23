import { db } from './dexiedb';

export async function putArray(inputArray, objectstorename) {
	try {
		let i,
			j,
			chunk = inputArray.length / 10,
			counter = 0;
		if (chunk < 200) {
			chunk = inputArray.length;
		}
		for (i = 0, j = inputArray.length; i < j; i += chunk) {
			const data = inputArray.slice(i, i + chunk);
			const items = [];
			for (const item of data) {
				// console.log('item', item);
				cleanUpObject(item);
				// console.log('after removeEmpty(item)', item);
				items.push(item);
				counter++;
			}

			await db[objectstorename].bulkPut(items);
			postMessage({ progress: counter, objectstorename });
		}

		return true;
	} catch (err) {
		console.log('worker error in putArray', err);
	}
}

export async function put(input, objectstorename) {
	try {
		return await await db[objectstorename].put(input);
	} catch (err) {
		console.log('worker error in add', err);
	}
}

export async function getCount(objectStore) {
	try {
		return await db[objectStore].count();
	} catch (err) {
		console.log('worker error', err);
	}
}

export async function getAll(objectStore) {
	try {
		return await db[objectStore].toArray();
	} catch (err) {
		console.log('worker error', err);
	}
}

export async function get(id, objectStore) {
	try {
		return await db[objectStore].get(id);
	} catch (err) {
		console.log('worker error in get', err);
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
