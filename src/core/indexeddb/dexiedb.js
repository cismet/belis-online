// db.js
import Dexie from 'dexie';

const DBVERSION = 13;
const DBNAME = 'Belis3';

export const db = new Dexie(DBNAME);
db.version(DBVERSION).stores({
	_meta: 'id',
	_test: 'id',
	anlagengruppe: 'id',
	arbeitsprotokollstatus: 'id',
	bauart: 'id',
	infobaustein: 'id',
	leitungstyp: 'id',
	leuchtmittel: 'id',
	material_leitung: 'id',
	material_mauerlasche: 'id',
	querschnitt: 'id',
	team: 'id',
	tkey_bezirk: 'id',
	tkey_doppelkommando: 'id',
	tkey_energielieferant: 'id',
	tkey_kennziffer: 'id',
	tkey_klassifizierung: 'id',
	tkey_mastart: 'id',
	tkey_strassenschluessel: 'id',
	tkey_unterh_leuchte: 'id',
	tkey_unterh_mast: 'id',
	veranlassungsart: 'id',
	arbeitsprotokollaktion: 'id',
	infobaustein_template: 'id',
	rundsteuerempfaenger: 'id',
	abzweigdose: 'id',
	tkey_leuchtentyp: 'id',
	tkey_masttyp: 'id',
	arbeitsauftrag: 'id',
	leitung: 'id',
	mauerlasche: 'id',
	schaltstelle: 'id',
	arbeitsprotokoll: 'id',
	tdta_leuchten: 'id',
	veranlassung: 'id',
	tdta_standort_mast: 'id',
	raw_point_index: 'id',
	all_tdta_standort_mast: 'id'
});
