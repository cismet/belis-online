// db.js
import Dexie from "dexie";

const DBVERSION = 20;
const DBNAME = "Belis3";

export const initialize = (db) => {
  db.version(DBVERSION).stores({
    _meta: "id",
    _test: "id",
    tdta_leuchten: "id",
    tdta_standort_mast: "id",
    raw_point_index: "id",
    leitung: "id",
    mauerlasche: "id",
    schaltstelle: "id",
    abzweigdose: "id",
    team: "id",
    arbeitsauftrag: "id",
    tkey_leuchtentyp: "id",
    leuchtmittel: "id",
    rundsteuerempfaenger: "id",
    // anlagengruppe: 'id',
    // arbeitsprotokollstatus: 'id',
    // bauart: 'id',
    // infobaustein: 'id',
    // leitungstyp: 'id',
    // leuchtmittel: 'id',
    // material_leitung: 'id',
    // material_mauerlasche: 'id',
    // querschnitt: 'id',
    // team: 'id',
    // tkey_bezirk: 'id',
    // tkey_doppelkommando: 'id',
    // tkey_energielieferant: 'id',
    // tkey_kennziffer: 'id',
    // tkey_klassifizierung: 'id',
    // tkey_mastart: 'id',
    // tkey_strassenschluessel: 'id',
    // tkey_unterh_leuchte: 'id',
    // tkey_unterh_mast: 'id',
    // veranlassungsart: 'id',
    // arbeitsprotokollaktion: 'id',
    // infobaustein_template: 'id',
    // rundsteuerempfaenger: 'id',
    // tkey_leuchtentyp: 'id',
    // tkey_masttyp: 'id',
    // arbeitsauftrag: 'id',
    // arbeitsprotokoll: 'id',
    // veranlassung: 'id',

    // all_tdta_standort_mast: 'id'
  });
  return db;
};

export const db = new Dexie(DBNAME);
initialize(db);
