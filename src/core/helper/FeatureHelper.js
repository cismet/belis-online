import { db } from '../indexeddb/dexiedb';
import length from "@turf/length"

export const getVCard = (item) => {
    const vcard = {};

    if (item.properties !== undefined) {
        alert('Fehler');
    }

    switch(item.featuretype) {
        case 'tdta_leuchten':
            const typPart = (item?.fk_leuchttyp?.leuchtentyp !== undefined ? item?.fk_leuchttyp?.leuchtentyp : 'Leuchte');
            const nrPart = '-' + (item?.leuchtennummer !== undefined ? item?.leuchtennummer : '0');
            const standortPart = (item?.fk_standort?.lfd_nummer !== undefined ? ', ' + item?.standort?.lfd_nummer : '');
            vcard['title'] = typPart.concat(nrPart, standortPart);
            vcard['subtitle'] = (item?.fk_leuchttyp?.fabrikat !== undefined ? item?.fk_leuchttyp?.fabrikat : '-ohne Fabrikat-');
            vcard['location'] = item?.fk_strassenschluessel?.strasse;
            break;
        case 'Leitung':
        case 'leitung':
            const laengePart = (item?.feature?.geometry !== undefined ? Math.round(length(item.feature.geometry) * 100) / 100 + 'm' : '?m');
            const aPart = (item?.fk_querschnitt?.groesse !== undefined ? item?.fk_querschnitt?.groesse + 'mm²': '');
            vcard['title'] = (item?.fk_leitungstyp?.bezeichnung !== undefined ? item?.fk_leitungstyp?.bezeichnung : 'Leitung');
            vcard['subtitle'] = laengePart + aPart;
            vcard['location'] = item.id;
            break;
        case 'mauerlasche':
            vcard['title'] = 'M-' + item.laufende_nummer;
            vcard['subtitle'] = (item?.fk_material?.bezeichnung !== undefined ? item?.fk_material?.bezeichnung : 'Mauerlasche');
            vcard['location'] = (item?.fk_strassenschluessel?.strasse !== undefined ? item?.fk_strassenschluessel?.strasse : '-');
            break;
        case 'schaltstelle':
            let title = (item?.fk_bauart?.bezeichnung !== undefined ? item?.fk_bauart?.bezeichnung : 'Schaltstelle');

            if (item?.schaltstellen_nummer !== undefined) {
                title = title.concat(' - ', item?.schaltstellen_nummer);
            }

            vcard['title'] = title;
            vcard['subtitle'] = '-';
            vcard['location'] = (item?.fk_strassenschluessel?.strasse !== undefined ? item?.fk_strassenschluessel?.strasse : '-');
            break;
        case 'abzweigdose':
            vcard['title'] = 'AZD ' + item.id;
            vcard['subtitle'] = 'Abzweigdose';
            vcard['location'] = '';
            break;
        case 'tdta_standort_mast':
            const mastStandortPart = (item?.lfd_nummer !== undefined ? item?.lfd_nummer : '');
            vcard['title'] = 'Mast - ' + mastStandortPart;
            vcard['subtitle'] = (item?.fk_mastart?.mastart !== undefined ? item?.fk_mastart?.mastart : '-ohne Mastart-');
            vcard['location'] = (item?.fk_strassenschluessel?.strasse !== undefined ? item?.fk_strassenschluessel?.strasse : '-');
            break;
        default:
    }

    return vcard;
};

export const convertFeatureToItem = async (feature) => {
    const item = {};
    item.featuretype = feature.featuretype;
    item.feature = feature;

    switch(feature.featuretype) {
        case 'tdta_leuchten':
            item.compare = (a,b) => {
                if (a.fk_strassenschluessel?.strasse === b.fk_strassenschluessel?.strasse) {
                    if (a.kennziffer?.kennziffer === b.kennziffer?.kennziffer) {
                        if (a.lfd_nummer === b.lfd_nummer) {
                            return compareValue(a.leuchtennummer, b.leuchtennummer);
                        } else {
                            return compareValue(a.lfd_nummer, b.lfd_nummer);
                        }                    
                    } else {
                        return compareValue(a.kennziffer?.kennziffer, b.kennziffer?.kennziffer);
                    }                    
                } else {
                    return compareValue(a.fk_strassenschluessel?.strasse, b.fk_strassenschluessel?.strasse);
                }
            }
            if (feature.properties === undefined) {
                console.log('feature without properties');
                break;
            }            
            copyFields(item, feature, ['plz', 'leuchtennummer', 'id', 'einbaudatum', 'anschlussleistung_1dk', 'vorschaltgeraet', 'anschlussleistung_2dk', 'schaltstelle', 'anzahl_1dk', 'anzahl_2dk', 'lfd_Nummer', 'is_deleted', 'wartungszyklus', 'lebensdauer', 'monteur', 'naechster_wechsel', 'wechselvorschaltgeraet', 'wechseldatum', 'zaehler', 'montagefirma_leuchte', 'inbetriebnahme_leuchte', 'bemerkungen']);
            await addFieldByFK(db, item, "rundsteuerempfaenger", 'rundsteuerempfaenger', feature.properties.rundsteuerempfaenger);
            await addFieldByFK(db, item, "tkey_strassenschluessel", 'fk_strassenschluessel', feature.properties.fk_strassenschluessel);
            await addFieldByFK(db, item, "tkey_kennziffer", 'fk_kennziffer', feature.properties.fk_kennziffer);
            await addFieldByFK(db, item, "tkey_leuchtentyp", 'fk_leuchttyp', feature.properties.fk_leuchttyp);
            await addFieldByFK(db, item, "tkey_unterh_leuchte", 'fk_unterhaltspflicht_leuchte', feature.properties.fk_unterhaltspflicht_leuchte);
            await addFieldByFK(db, item, "tkey_energielieferant", 'fk_energielieferant', feature.properties.fk_energielieferant);
            await addFieldByFK(db, item, "leuchtmittel", 'leuchtmittel', feature.properties.leuchtmittel);
            await addFieldByFK(db, item, "tdta_standort_mast", 'fk_standort', feature.properties.fk_standort);
            break;
        case 'Leitung':
        case 'leitung':
            copyFields(item, feature, ['laenge', 'is_deleted', 'id']);
            await addFieldByFK(db, item, "leitungstyp", 'fk_leitungstyp', feature.properties.fk_leitungstyp);
            await addFieldByFK(db, item, "material_leitung", 'fk_material', feature.properties.fk_material);
            await addFieldByFK(db, item, "querschnitt", 'fk_querschnitt', feature.properties.fk_querschnitt);
            await addFieldByFK(db, item, "leitungstyp", 'fk_geom', feature.properties.fk_geom);
            item.compare = (a,b) => {
//                let ay=a.getPointOfObject().dimensionY
//                let by=b.getPointOfObject().dimensionY
                //todo: anpassen
                return compareValue(a.id, b.id);
            }
            break;
        case 'mauerlasche':
            copyFields(item, feature, ['laufende_nummer', 'pruefdatum', 'is_deleted', 'id', 'bemerkung', 'monteur', 'erstellungsjahr']);
            await addFieldByFK(db, item, "material_mauerlasche", 'fk_material', feature.properties.fk_material);
            await addFieldByFK(db, item, "tkey_strassenschluessel", 'fk_strassenschluessel', feature.properties.fk_strassenschluessel);
            await addFieldByFK(db, item, "jt_mauerlasche_dokument", 'dokumente', feature.properties.dokumente);
            await addFieldByFK(db, item, "dms_url", 'fk_leifototungstyp', feature.properties.fk_leifototungstyp);
            item.compare = (a,b) => {
                if (a.fk_strassenschluessel?.strasse === b.fk_strassenschluessel?.strasse) {
                    if (a.laufende_nummer === b.laufende_nummer) {
                        return compareValue(a.id, b.id);
                    } else {
                        return compareValue(a.laufende_nummer, b.laufende_nummer);
                    }                    
                } else {
                    return compareValue(a.fk_strassenschluessel?.strasse, b.fk_strassenschluessel?.strasse);
                }
            }
            break;
        case 'schaltstelle':
            copyFields(item, feature, ['bemerkung', 'haus_nummer', 'schaltstellen_nummer', 'id', 'erstellungsjahr', 'is_deleted', 'laufende_nummer', 'pruefdatum', 'monteur', 'einbaudatum_rs', 'zusaetzliche_standortbezeichnung']);
            await addFieldByFK(db, item, "rundsteuerempfaenger", 'rundsteuerempfaenger', feature.properties.rundsteuerempfaenger);
            await addFieldByFK(db, item, "jt_schaltstelle_dokument", 'dokumente', feature.properties.dokumente);
            await addFieldByFK(db, item, "bauart", 'fk_bauart', feature.properties.fk_bauart);
            await addFieldByFK(db, item, "dms_url", 'foto', feature.properties.foto);
            await addFieldByFK(db, item, "tkey_strassenschluessel", 'fk_strassenschluessel', feature.properties.fk_strassenschluessel);
            item.compare = (a,b) => {
                if (a.fk_strassenschluessel?.strasse === b.fk_strassenschluessel?.strasse) {
                    let titleA = (a?.fk_bauart?.bezeichnung !== undefined ? a?.fk_bauart?.bezeichnung : 'Schaltstelle');

                    if (a?.schaltstellen_nummer !== undefined) {
                        titleA = titleA.concat(' - ', a?.schaltstellen_nummer);
                    }
                    let titleB = (b?.fk_bauart?.bezeichnung !== undefined ? b?.fk_bauart?.bezeichnung : 'Schaltstelle');

                    if (b?.schaltstellen_nummer !== undefined) {
                        titleB = titleB.concat(' - ', b?.schaltstellen_nummer);
                    }
                    return compareValue(titleA, titleB);
                } else {
                    return compareValue(a.fk_strassenschluessel?.strasse, b.fk_strassenschluessel?.strasse);
                }
            }
            break;
        case 'abzweigdose':
            copyFields(item, feature, ['is_deleted', 'id']);
            await addFieldByFK(db, item, "jt_abzweigdose_dokument", 'dokumente', feature.properties.dokumente);
            item.compare = (a,b) => {
                return compareValue(a.id, b.id);
            }
            break;
        case 'tdta_standort_mast':
            copyFields(item, feature, ['inbetriebnahme_mast', 'letzte_aenderung', 'id', 'verrechnungseinheit', 'standortangabe', 'plz', 'anbauten', 'elek_pruefung', 'revision', 'standsicherheitspruefung', 'lfd_nummer', 'montagefirma', 'is_deleted', 'anstrichfarbe', 'monteur', 'bemerkungen', 'gruendung', 'verfahren', 'erdung', 'haus_nr', 'naechstes_pruefdatum', 'mastanstrich', 'mastschutz', 'ist_virtueller_standort']);
            await addFieldByFK(db, item, "tkey_kennziffer", 'fk_kennziffer', feature.properties.fk_kennziffer);
            await addFieldByFK(db, item, "anlagengruppe", 'anlagengruppe', feature.properties.anlagengruppe);
            await addFieldByFK(db, item, "tkey_bezirk", 'fk_stadtbezirk', feature.properties.fk_stadtbezirk);
            await addFieldByFK(db, item, "tkey_klassifizierung", 'fk_klassifizierung', feature.properties.fk_klassifizierung);
            await addFieldByFK(db, item, "tkey_masttyp", 'fk_masttyp', feature.properties.fk_masttyp);
            await addFieldByFK(db, item, "tkey_mastart", 'fk_mastart', feature.properties.fk_mastart);
            await addFieldByFK(db, item, "tkey_unterh_mast", 'fk_unterhaltspflicht_mast', feature.properties.fk_unterhaltspflicht_mast);
            await addFieldByFK(db, item, "tkey_strassenschluessel", 'fk_strassenschluessel', feature.properties.fk_strassenschluessel);
            await addFieldByFK(db, item, "jt_standort_dokument", 'dokumente', feature.properties.dokumente);
            await addFieldByFK(db, item, "tdta_leuchten", 'leuchten', feature.properties.leuchten);
            await addFieldByFK(db, item, "tkey_doppelkommando", 'foto', feature.properties.foto);
            item.compare = (a,b) => {
                if (a.fk_strassenschluessel?.strasse === b.fk_strassenschluessel?.strasse) {
                    let titleA = (a?.lfd_nummer !== undefined ? a?.lfd_nummer : '');
                    titleA = 'Mast - ' + titleA;
                    let titleB = (b?.lfd_nummer !== undefined ? b?.lfd_nummer : '');
                    titleB = 'Mast - ' + titleB;

                    return compareValue(titleA, titleB);
                } else {
                    return compareValue(a.fk_strassenschluessel?.strasse, b.fk_strassenschluessel?.strasse);
                }
            }
            break;
        default:
    }

    return item;
};

const compareValue = (a,b) => {
    if (a === b) {
        return 0;
    } else if (a < b) {
        return -1;
    } else {
        return 1;
    }
}

const addFieldByFK = async (db, item, tablename, fieldname, fkId) => {
    if (fkId !== undefined && fkId !== null) {
        const tab = await db.table(tablename);
        let value = await tab.get({id: fkId});
        item[fieldname] = value;
    }
};

const copyFields = (item, feature, fieldnames) => {
    for (const field of fieldnames) {
        item[field] = feature.properties[field];
    }
};

