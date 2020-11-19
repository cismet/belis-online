import { openDB } from 'idb/with-async-ittr.js';

export const dbPromise = openDB('Belis', 9, {
	upgrade(db) {
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
	}
});

function createOrClearObjectStore(db, storename, options = { keyPath: 'id' }) {
	try {
		db.createObjectStore(storename, options);
	} catch (e) {
		console.log('error during createobjectstore');
	}
}
