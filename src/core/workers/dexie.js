import { db } from "../indexeddb/dexiedb";
// import getPropertiesForFeature from "../store/slices/featureCollection";
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
    console.log("worker error in putArray", err);
  }
}

export async function updateSingleCacheItems(updates) {
  console.log("xxx updateSingleCacheItems", updates);

  for (const key of Object.keys(updates)) {
    console.log("update", key);
    await db[key].bulkPut(updates[key]);
  }
}

export async function put(input, objectstorename) {
  try {
    return await await db[objectstorename].put(input);
  } catch (err) {
    console.log("worker error in add", err);
  }
}

export async function getCount(objectStore) {
  try {
    return await db[objectStore].count();
  } catch (err) {
    console.log("worker error", err);
  }
}

export async function getAll(objectStore) {
  try {
    return await db[objectStore].toArray();
  } catch (err) {
    console.log("worker error", err);
  }
}

export async function get(id, objectStore) {
  try {
    return await db[objectStore].get(id);
  } catch (err) {
    console.log("worker error in get", err);
  }
}

// async function _template(input) {
// 	try {
// 		return await new Promise((resolve, reject) => {
// 			resolve({ debugLog: 'dummy answer', data: 'xxx' });
// 		});
// 	} catch (err) {
// 		console.log('worker error in _template', err);
// 	}
// }

//tools

const cleanUpObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && Array.isArray(obj[key]) === false) {
      cleanUpObject(obj[key]); // recurse
    } else if (
      obj[key] &&
      typeof obj[key] === "object" &&
      Array.isArray(obj[key]) === true &&
      obj[key].length === 0
    ) {
      delete obj[key]; // delete
    } else if (obj[key] == null) {
      delete obj[key]; // delete
    }
  });
};

export const getFeaturesForHits = async (points, resultIds, filter) => {
  const featureCollection = [];

  const tablenames = new Set();
  for (const id of resultIds) {
    const hit = points[id];
    tablenames.add(hit.tablename);
    const featureObject = await db[hit.tablename].get(hit.oid);

    if (featureObject) {
      if ((filter[hit.tablename] || {}).enabled === true) {
        let addFeature;
        if (hit.tablename === "tdta_standort_mast") {
          if (featureObject === undefined) {
            addFeature = false;
          } else {
            addFeature = true;
          }
        } else {
          addFeature = true;
        }

        if (addFeature === true) {
          // let d = new Date().getTime();
          const feature = {
            text: "-",
            type: "Feature",
            selected: false,
            featuretype: hit.tablename,
            id: hit.tablename,
            geometry: {
              type: "Point",
              coordinates: [hit.x, hit.y],
            },
            crs: {
              type: "name",
              properties: {
                name: "urn:ogc:def:crs:EPSG::25832",
              },
            },
            properties: {},
          };

          feature.properties = featureObject; //getPropertiesForFeature(feature);
          feature.id = feature.id + "-" + featureObject.id;

          featureCollection.push(feature);
        }
        // //console.log('xxx Feature gebaut ', new Date().getTime() - d);
      }
    } else {
      if (hit.tablename !== "tdta_standort_mast") {
        console.log("could not find " + hit.tablename + "." + hit.oid);
      }
    }
  }

  return featureCollection;
};

// function timeout(ms) {
// 	return new Promise((resolve) => setTimeout(resolve, ms));
// }
