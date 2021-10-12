import { db } from "../indexeddb/dexiedb";
import length from "@turf/length";
import proj4 from "proj4";

const calcLength = (geom) => {
  let newCoords = [];
  const proj4crs25832def = "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs";
  const targetCrs = proj4.defs("EPSG:4326");
  let isMulti = false;

  try {
    for (const coord of geom.coordinates) {
      if (geom.type === "MultiLineString") {
        let coordArray = [];
        isMulti = true;

        for (const coordPair of coord) {
          const transformedGeom = proj4(proj4crs25832def, targetCrs, coordPair);
          coordArray.push(transformedGeom);
        }
        newCoords.push(coordArray);
      } else {
        const transformedGeom = proj4(proj4crs25832def, targetCrs, coord);
        newCoords.push(transformedGeom);
      }
    }
  } catch (o) {
    console.log("cannot calculate geometry length " + geom);
  }

  const geo = {
    type: "Feature",
    geometry: {
      type: isMulti === true ? "MultiLineString" : "LineString",
      coordinates: newCoords,
    },
    properties: {},
  };

  let len = length(geo, "kilometers");
  return len * 1000;
};

export const getVCard = (feature) => {
  const vcard = { list: {}, infobox: {} };

  const item = feature.properties;
  switch (feature.featuretype) {
    case "tdta_leuchten":
      const typPart =
        item?.fk_leuchttyp?.leuchtentyp !== undefined ? item?.fk_leuchttyp?.leuchtentyp : "Leuchte";
      const nrPart = "-" + (item?.leuchtennummer !== undefined ? item?.leuchtennummer : "0");
      const standortPart =
        item?.fk_standort?.lfd_nummer !== undefined ? ", " + item?.fk_standort?.lfd_nummer : "";

      // Infobox
      const mastinfo = [];

      const mastart = item?.fk_standort?.mastart?.mastart;
      const masttyp = item?.fk_standort?.masttyp?.masttyp;

      if (mastart) {
        mastinfo.push(mastart);
      }
      if (masttyp) {
        mastinfo.push(masttyp);
      }

      vcard.infobox.header = item?.fk_leuchttyp?.fabrikat || "Leuchte ohne Fabrikat";
      if (mastinfo.length > 0) {
        vcard.infobox.header += "  (" + mastinfo.join(" - ") + ")";
      }
      vcard.infobox.title = typPart.concat(nrPart, standortPart);
      vcard.infobox.subtitle = item?.fk_strassenschluessel?.strasse;
      vcard.infobox.more = "";
      // List
      vcard.list.main = typPart.concat(nrPart, standortPart);
      vcard.list.upperright = item?.fk_strassenschluessel?.strasse;
      vcard.list.subtitle =
        item?.fk_leuchttyp?.fabrikat !== undefined
          ? item?.fk_leuchttyp?.fabrikat
          : "-ohne Fabrikat-";

      break;
    case "Leitung":
    case "leitung":
      //            const laengePart = (item?.feature?.geometry !== undefined ? Math.round(length(item.feature.geometry) * 100) / 100 + 'm' : '?m');
      const laengePart =
        feature?.geometry !== undefined
          ? Math.round(calcLength(feature.geometry) * 100) / 100 + "m"
          : "?m";
      const aPart =
        item?.fk_querschnitt?.groesse !== undefined
          ? ", " + item?.fk_querschnitt?.groesse + "mm²"
          : "";

      // Infobox
      vcard.infobox.header =
        item?.fk_leitungstyp?.bezeichnung !== undefined
          ? item?.fk_leitungstyp?.bezeichnung
          : "Leitung";
      vcard.infobox.title = "L-" + item.id;
      vcard.infobox.subtitle = laengePart + aPart;
      vcard.infobox.more = undefined;

      // List
      vcard.list.main = "L-" + item.id;

      vcard.list.upperright = laengePart + aPart;
      vcard.list.subtitle =
        item?.fk_leitungstyp?.bezeichnung !== undefined
          ? item?.fk_leitungstyp?.bezeichnung
          : "Leitung";

      break;
    case "mauerlasche": {
      const location =
        item?.fk_strassenschluessel?.strasse !== undefined
          ? item?.fk_strassenschluessel?.strasse
          : "-";
      // Infobox
      vcard.infobox.header =
        item?.fk_material?.bezeichnung !== undefined
          ? item?.fk_material?.bezeichnung
          : "Mauerlasche";
      vcard.infobox.title = "M-" + item.laufende_nummer;
      vcard.infobox.subtitle = location;
      vcard.infobox.more = undefined;

      // List
      vcard.list.main = "M-" + item.laufende_nummer;
      vcard.list.upperright = location;
      vcard.list.subtitle = vcard.infobox.header;

      break;
    }

    case "schaltstelle": {
      let header =
        item?.fk_bauart?.bezeichnung !== undefined ? item?.fk_bauart?.bezeichnung : "Schaltstelle";

      // if (item?.schaltstellen_nummer !== undefined) {
      //   title = title.concat(" - ", item?.schaltstellen_nummer);
      // }

      const title = "S-" + item?.id;

      const l =
        item?.fk_strassenschluessel?.strasse !== undefined
          ? item?.fk_strassenschluessel?.strasse
          : "-";
      // Infobox
      vcard.infobox.header = header;
      vcard.infobox.title = title;
      vcard.infobox.subtitle = l;
      vcard.infobox.more = undefined;

      // List
      vcard.list.main = title;
      vcard.list.upperright = l;
      vcard.list.subtitle = header;

      break;
    }
    case "abzweigdose": {
      // Infobox
      vcard.infobox.header = "Abzweigdose";
      vcard.infobox.title = "AZD-" + item.id;
      vcard.infobox.subtitle = undefined;
      vcard.infobox.more = undefined;
      // List
      vcard.list.main = "AZD-" + item.id;
      vcard.list.upperright = undefined;
      vcard.list.subtitle = "Abzweigdose";

      break;
    }
    case "tdta_standort_mast": {
      const mastStandortPart = item?.lfd_nummer !== undefined ? item?.lfd_nummer : "";
      const title = "Mast - " + mastStandortPart;

      const location =
        item?.fk_strassenschluessel?.strasse !== undefined
          ? item?.fk_strassenschluessel?.strasse
          : "-";
      // Infobox
      vcard.infobox.header =
        item?.fk_mastart?.mastart !== undefined ? item?.fk_mastart?.mastart : "Mast ohne Mastart";
      vcard.infobox.title = title;
      vcard.infobox.subtitle = location;

      // List
      vcard.list.main = title;
      vcard.list.upperright = location;
      vcard.list.subtitle =
        item?.fk_mastart?.mastart !== undefined ? item?.fk_mastart?.mastart : "-ohne Mastart-";
      break;
    }
    default:
  }

  return vcard;
};

const addDmsUrl = (docs, dmsUrl, caption) => {
  if (dmsUrl?.url?.object_name) {
    try {
      docs.push({
        caption: caption + " ",
        doc: dmsUrl.url.object_name,
        description: dmsUrl?.description,
      });
    } catch (e) {
      console.log("error" + e, dmsUrl);
    }
  }
};
const addDokumenteArrayOfDmsUrls = (docs, dArray, caption) => {
  for (const doc of dArray || []) {
    addDmsUrl(docs, doc.dms_url, caption);
  }
};

export const addPropertiesToFeature = async (feature) => {
  if (feature?.enriched !== true) {
    const item = {};
    item.docs = [];

    switch (feature.featuretype) {
      case "tdta_leuchten":
        copyFields(item, feature, [
          "plz",
          "leuchtennummer",
          "id",
          "einbaudatum",
          "anschlussleistung_1dk",
          "vorschaltgeraet",
          "anschlussleistung_2dk",
          "schaltstelle",
          "anzahl_1dk",
          "anzahl_2dk",
          "lfd_Nummer",
          "is_deleted",
          "wartungszyklus",
          "lebensdauer",
          "monteur",
          "naechster_wechsel",
          "wechselvorschaltgeraet",
          "wechseldatum",
          "zaehler",
          "montagefirma_leuchte",
          "inbetriebnahme_leuchte",
          "bemerkungen",
          "full_tdta_standort_mast",
          "dokumenteArray",
        ]);
        await addFieldByFK(
          db,
          item,
          "rundsteuerempfaenger",
          "rundsteuerempfaenger",
          feature.properties.rundsteuerempfaenger
        );
        await addFieldByFK(
          db,
          item,
          "tkey_strassenschluessel",
          "fk_strassenschluessel",
          feature.properties.fk_strassenschluessel
        );
        await addFieldByFK(
          db,
          item,
          "tkey_kennziffer",
          "fk_kennziffer",
          feature.properties.fk_kennziffer
        );
        await addFieldByFK(
          db,
          item,
          "tkey_leuchtentyp",
          "fk_leuchttyp",
          feature.properties.fk_leuchttyp
        );
        await addFieldByFK(
          db,
          item,
          "tkey_unterh_leuchte",
          "fk_unterhaltspflicht_leuchte",
          feature.properties.fk_unterhaltspflicht_leuchte
        );
        await addFieldByFK(
          db,
          item,
          "tkey_energielieferant",
          "fk_energielieferant",
          feature.properties.fk_energielieferant
        );
        await addFieldByFK(
          db,
          item,
          "leuchtmittel",
          "leuchtmittel",
          feature.properties.leuchtmittel
        );

        if (item.full_tdta_standort_mast) {
          item.fk_standort = item.full_tdta_standort_mast;
        } else {
          await addFieldByFK(
            db,
            item,
            "all_tdta_standort_mast",
            "fk_standort",
            feature.properties.fk_standort
          );
        }
        await addFieldByFK(
          db,
          item.fk_standort,
          "tkey_mastart",
          "mastart",
          item.fk_standort.fk_mastart
        );
        await addFieldByFK(
          db,
          item.fk_standort,
          "tkey_unterh_mast",
          "unterhaltspflicht_mast",
          item.fk_standort.fk_unterhaltspflicht_mast
        );
        await addFieldByFK(
          db,
          item.fk_standort,
          "tkey_masttyp",
          "masttyp",
          item.fk_standort.fk_masttyp
        );
        await addFieldByFK(
          db,
          item.fk_standort,
          "tkey_kennziffer",
          "kennziffer",
          item.fk_standort.fk_kennziffer
        );
        await addFieldByFK(
          db,
          item.fk_standort,
          "anlagengruppe",
          "anlgruppe",
          item.fk_standort.anlagengruppe
        );
        await addFieldByFK(
          db,
          item.fk_standort,
          "tkey_bezirk",
          "stadtbezirk",
          item.fk_standort.fk_stadtbezirk
        );
        await addFieldByFK(
          db,
          item.fk_standort,
          "tkey_klassifizierung",
          "klassifizierung",
          item.fk_standort.fk_klassifizierung
        );

        await addFieldByFK(db, item, "tkey_doppelkommando", "fk_dk1", feature.properties.fk_dk1);
        await addFieldByFK(db, item, "tkey_doppelkommando", "fk_dk2", feature.properties.fk_dk2);

        addDokumenteArrayOfDmsUrls(item.docs, item?.dokumenteArray, "Leuchte");
        addDokumenteArrayOfDmsUrls(item.docs, item?.fk_standort?.dokumenteArray, "Standort");
        addDmsUrl(item.docs, item?.fk_leuchttyp?.dms_url, "Leuchtentyp");
        addDokumenteArrayOfDmsUrls(item.docs, item?.fk_leuchttyp?.dokumenteArray, "Leuchtentyp");
        addDmsUrl(item.docs, item?.fk_standort?.tkey_masttyp?.dms_url, "Masttyp");
        addDokumenteArrayOfDmsUrls(
          item.docs,
          item?.fk_standort?.tkey_masttyp?.dokumenteArray,
          "Masttyp"
        );

        break;
      case "Leitung":
      case "leitung":
        copyFields(item, feature, ["laenge", "is_deleted", "id", "dokumenteArray"]);
        await addFieldByFK(
          db,
          item,
          "leitungstyp",
          "fk_leitungstyp",
          feature.properties.fk_leitungstyp
        );
        await addFieldByFK(
          db,
          item,
          "material_leitung",
          "fk_material",
          feature.properties.fk_material
        );
        await addFieldByFK(
          db,
          item,
          "querschnitt",
          "fk_querschnitt",
          feature.properties.fk_querschnitt
        );
        await addFieldByFK(db, item, "leitungstyp", "fk_leitungstyp", feature.properties.fk_geom);
        await addFieldByFK(db, item, "tkey_doppelkommando", "fk_dk1", feature.properties.fk_dk1);
        await addFieldByFK(db, item, "tkey_doppelkommando", "fk_dk2", feature.properties.fk_dk2);

        addDokumenteArrayOfDmsUrls(item.docs, item?.dokumenteArray, "Leitung");

        break;
      case "mauerlasche":
        copyFields(item, feature, [
          "laufende_nummer",
          "pruefdatum",
          "is_deleted",
          "id",
          "bemerkung",
          "monteur",
          "erstellungsjahr",
          "dokumenteArray",
        ]);
        await addFieldByFK(
          db,
          item,
          "material_mauerlasche",
          "fk_material",
          feature.properties.fk_material
        );
        await addFieldByFK(
          db,
          item,
          "tkey_strassenschluessel",
          "fk_strassenschluessel",
          feature.properties.fk_strassenschluessel
        );
        await addFieldByFK(db, item, "dms_url", "foto", feature.properties.foto);

        addDokumenteArrayOfDmsUrls(item.docs, item?.dokumenteArray, "Mauerlasche");

        break;
      case "schaltstelle":
        copyFields(item, feature, [
          "bemerkung",
          "haus_nummer",
          "schaltstellen_nummer",
          "id",
          "erstellungsjahr",
          "is_deleted",
          "laufende_nummer",
          "pruefdatum",
          "monteur",
          "einbaudatum_rs",
          "zusaetzliche_standortbezeichnung",
          "dokumenteArray",
        ]);
        await addFieldByFK(
          db,
          item,
          "rundsteuerempfaenger",
          "rundsteuerempfaenger",
          feature.properties.rundsteuerempfaenger
        );

        await addFieldByFK(db, item, "bauart", "fk_bauart", feature.properties.fk_bauart);
        await addFieldByFK(db, item, "dms_url", "foto", feature.properties.foto);
        await addFieldByFK(
          db,
          item,
          "tkey_strassenschluessel",
          "fk_strassenschluessel",
          feature.properties.fk_strassenschluessel
        );
        addDokumenteArrayOfDmsUrls(item.docs, item?.dokumenteArray, "Schaltstelle");
        addDmsUrl(item.docs, item?.rundsteuerempfaenger?.dms_url, "Rundsteuerempfänger");

        break;
      case "abzweigdose":
        copyFields(item, feature, ["is_deleted", "id", "dokumenteArray"]);
        addDokumenteArrayOfDmsUrls(item.docs, item?.dokumenteArray, "Abzweigdose");

        break;
      case "tdta_standort_mast":
        copyFields(item, feature, [
          "inbetriebnahme_mast",
          "letzte_aenderung",
          "id",
          "verrechnungseinheit",
          "standortangabe",
          "plz",
          "anbauten",
          "elek_pruefung",
          "revision",
          "standsicherheitspruefung",
          "lfd_nummer",
          "montagefirma",
          "is_deleted",
          "anstrichfarbe",
          "monteur",
          "bemerkungen",
          "gruendung",
          "verfahren",
          "erdung",
          "haus_nr",
          "naechstes_pruefdatum",
          "mastanstrich",
          "mastschutz",
          "ist_virtueller_standort",
          "dokumenteArray",
        ]);
        await addFieldByFK(
          db,
          item,
          "tkey_kennziffer",
          "fk_kennziffer",
          feature.properties.fk_kennziffer
        );
        await addFieldByFK(
          db,
          item,
          "anlagengruppe",
          "anlagengruppe",
          feature.properties.anlagengruppe
        );
        await addFieldByFK(
          db,
          item,
          "tkey_bezirk",
          "fk_stadtbezirk",
          feature.properties.fk_stadtbezirk
        );
        await addFieldByFK(
          db,
          item,
          "tkey_klassifizierung",
          "fk_klassifizierung",
          feature.properties.fk_klassifizierung
        );
        await addFieldByFK(db, item, "tkey_masttyp", "fk_masttyp", feature.properties.fk_masttyp);
        await addFieldByFK(db, item, "tkey_mastart", "fk_mastart", feature.properties.fk_mastart);
        await addFieldByFK(
          db,
          item,
          "tkey_unterh_mast",
          "fk_unterhaltspflicht_mast",
          feature.properties.fk_unterhaltspflicht_mast
        );
        await addFieldByFK(
          db,
          item,
          "tkey_strassenschluessel",
          "fk_strassenschluessel",
          feature.properties.fk_strassenschluessel
        );
        await addFieldByFK(
          db,
          item,
          "jt_standort_dokument",
          "dokumente",
          feature.properties.dokumente
        );
        await addFieldByFK(db, item, "tdta_leuchten", "leuchten", feature.properties.leuchten);
        await addFieldByFK(db, item, "tkey_doppelkommando", "foto", feature.properties.foto);

        addDokumenteArrayOfDmsUrls(item.docs, item?.dokumenteArray, "Standort");
        addDmsUrl(item.docs, item?.tkey_masttyp?.dms_url, "Masttyp");
        addDokumenteArrayOfDmsUrls(item.docs, item?.tkey_masttyp?.dokumenteArray, "Masttyp");

        break;
      default:
    }

    item.feature = feature;
    const newFeature = JSON.parse(JSON.stringify(feature));
    newFeature.properties = item;
    newFeature.enriched = true;
    return newFeature;
  } else {
    //otherwise the setting of the index cannot be done
    return JSON.parse(JSON.stringify(feature));
  }
};

const compareValue = (a, b) => {
  if (a === b) {
    return 0;
  } else if (a < b) {
    return -1;
  } else {
    return 1;
  }
};

const addFieldByFK = async (db, item, tablename, fieldname, fkId) => {
  if (fkId !== undefined && fkId !== null) {
    const tab = await db.table(tablename);
    let value = await tab.get({ id: fkId });
    item[fieldname] = value;
  }
};

const copyFields = (item, feature, fieldnames) => {
  for (const field of fieldnames) {
    item[field] = feature.properties[field];
  }
};

export const compareFeature = (a, b) => {
  try {
    if (a.featuretype < b.featuretype) {
      return 1;
    } else if (a.featuretype > b.featuretype) {
      return -1;
    } else {
      switch (a.featuretype) {
        case "tdta_leuchten":
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

        case "Leitung":
        case "leitung":
          try {
            return compareValue(a.geometry.coordinates[0][1], b.geometry.coordinates[0][1]);
          } catch (e) {
            console.log("error during compare", e);

            console.log("... in item a,b", a, b);
            return -1;
          }

        case "mauerlasche":
          if (a.fk_strassenschluessel?.strasse === b.fk_strassenschluessel?.strasse) {
            let titleA =
              a?.fk_bauart?.bezeichnung !== undefined ? a?.fk_bauart?.bezeichnung : "Schaltstelle";

            if (a?.schaltstellen_nummer !== undefined) {
              titleA = titleA.concat(" - ", a?.schaltstellen_nummer);
            }
            let titleB =
              b?.fk_bauart?.bezeichnung !== undefined ? b?.fk_bauart?.bezeichnung : "Schaltstelle";

            if (b?.schaltstellen_nummer !== undefined) {
              titleB = titleB.concat(" - ", b?.schaltstellen_nummer);
            }
            return compareValue(titleA, titleB);
          } else {
            return compareValue(a.fk_strassenschluessel?.strasse, b.fk_strassenschluessel?.strasse);
          }

        case "abzweigdose":
          if (a.fk_strassenschluessel?.strasse === b.fk_strassenschluessel?.strasse) {
            let titleA = a?.lfd_nummer !== undefined ? a?.lfd_nummer : "";
            titleA = "Mast - " + titleA;
            let titleB = b?.lfd_nummer !== undefined ? b?.lfd_nummer : "";
            titleB = "Mast - " + titleB;

            return compareValue(titleA, titleB);
          } else {
            return compareValue(a.fk_strassenschluessel?.strasse, b.fk_strassenschluessel?.strasse);
          }

        default:
          return -1;
      }
    }
  } catch (e) {
    console.log("error in compare", e);
    console.log("a", a);
    console.log("b", b);

    return -1;
  }
};