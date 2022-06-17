import length from "@turf/length";
import proj4 from "proj4";

export const calcLength = (geom) => {
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

      const mastart = item?.fk_standort?.fk_mastart?.mastart;
      const masttyp = item?.fk_standort?.fk_masttyp?.masttyp;

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

      let title;
      if (item?.schaltstellen_nummer) {
        title = "S " + item?.schaltstellen_nummer;
      } else {
        title = "ID: " + item?.id;
      }

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
    case "arbeitsauftrag": {
      // Infobox
      vcard.infobox.header = "Arbeitsauftrag";
      vcard.infobox.title = "Nummer: A" + item.nummer;
      vcard.infobox.more = "angelegt von: " + item.angelegt_von;
      //propper date formatting
      vcard.infobox.subtitle =
        "am: " + item?.angelegt_am ? new Date(item.angelegt_am).toLocaleDateString() : "";
      // List
      vcard.list.main = "A" + item.nummer;
      vcard.list.upperright = item.angelegt_von;
      vcard.list.subtitle = item?.angelegt_am
        ? new Date(item.angelegt_am).toLocaleDateString()
        : "";
      vcard.list.lowerright = (item.ar_protokolleArray || []).length;

      break;
    }
    case "arbeitsprotokoll": {
      // Infobox
      vcard.infobox.header = "Arbeitsprotokoll";
      vcard.infobox.title = "# " + item.protokollnummer + " - " + item.fachobjekt.shortname;
      vcard.infobox.subtitle = "Veranlassung " + item.veranlassungsnummer;
      vcard.infobox.more = undefined;
      // List
      vcard.list.main = "#" + item.protokollnummer + " - " + item.fachobjekt.shortname;
      if (item.arbeitsprotokollstatus) {
        if (item.arbeitsprotokollstatus.schluessel === "0") {
          vcard.list.upperright = "🕒";
        } else if (item.arbeitsprotokollstatus.schluessel === "1") {
          vcard.list.upperright = "✅";
        } else if (item.arbeitsprotokollstatus.schluessel === "2") {
          vcard.list.upperright = " ❗️ ";
        }
      }

      vcard.list.subtitle = item.veranlassung?.bezeichnung || "???";

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
        caption: caption,
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
export const getDocs = (feature) => {
  const docs = [];

  let type, item;
  if (feature.featuretype === "arbeitsprotokoll") {
    addDokumenteArrayOfDmsUrls(
      docs,
      feature?.properties?.veranlassung?.ar_dokumenteArray,
      "Veranlassung"
    );

    type = feature.fachobjekttype;
    item = feature.properties.fachobjekt;
  } else {
    type = feature.featuretype;
    item = feature.properties;
  }

  switch (type) {
    case "tdta_leuchten":
      addDokumenteArrayOfDmsUrls(docs, item?.dokumenteArray, "Leuchte");
      addDokumenteArrayOfDmsUrls(docs, item?.fk_standort?.dokumenteArray, "Standort");
      addDmsUrl(docs, item?.fk_leuchttyp?.dms_url, "Leuchtentyp");
      addDokumenteArrayOfDmsUrls(docs, item?.fk_leuchttyp?.dokumenteArray, "Leuchtentyp");
      addDmsUrl(docs, item?.fk_standort?.tkey_masttyp?.dms_url, "Masttyp");
      addDokumenteArrayOfDmsUrls(docs, item?.fk_standort?.tkey_masttyp?.dokumenteArray, "Masttyp");
      return docs;
    case "Leitung":
    case "leitung":
      addDokumenteArrayOfDmsUrls(docs, item?.dokumenteArray, "Leitung");
      return docs;
    case "mauerlasche":
      addDokumenteArrayOfDmsUrls(docs, item?.dokumenteArray, "Mauerlasche");
      return docs;
    case "schaltstelle":
      addDokumenteArrayOfDmsUrls(docs, item?.dokumenteArray, "Schaltstelle");
      addDmsUrl(docs, item?.rundsteuerempfaenger?.dms_url, "Rundsteuerempfänger");
      return docs;
    case "abzweigdose":
      addDokumenteArrayOfDmsUrls(docs, item?.dokumenteArray, "Abzweigdose");
      return docs;
    case "tdta_standort_mast":
      addDokumenteArrayOfDmsUrls(docs, item?.dokumenteArray, "Standort");
      addDmsUrl(docs, item?.tkey_masttyp?.dms_url, "Masttyp");
      addDokumenteArrayOfDmsUrls(docs, item?.tkey_masttyp?.dokumenteArray, "Masttyp");
      return docs;
    case "arbeitsprotokoll":
      return docs;
    case "arbeitsauftrag":
      return docs;
    default:
      console.log("unknown featuretype. this should not happen");
      return docs;
  }
};

export const addPropertiesToFeature = async (feature) => {
  //otherwise the setting of the index cannot be done
  return JSON.parse(JSON.stringify(feature));
};

export const type2Caption = (type) => {
  switch (type) {
    case "tdta_leuchten":
      return "Leuchte";
    case "Leitung":
    case "leitung":
      return "Leitung";
    case "mauerlasche":
      return "Mauerlasche";
    case "schaltstelle":
      return "Schaltstelle";
    case "abzweigdose":
      return "Abzweigdose";
    case "tdta_standort_mast":
      return "Standort";
    default:
  }
};

const getIntermediateResultsImages = (item, intermediateResults, itemtype) => {
  if (
    item &&
    intermediateResults &&
    intermediateResults[itemtype] &&
    intermediateResults[itemtype][item.id]?.image
  ) {
    const docs = [];

    for (const image of intermediateResults[itemtype][item.id].image) {
      docs.push({
        intermediate: true,
        url: image.imageData,
        caption: type2Caption(itemtype),
        description: image.description,
      });
    }
    return docs;
  }
  return [];
};

export const getIntermediateResultsToBeRemoved = (feature) => {
  const item = feature.properties;
  const intermediateResultsToBeRemoved = [{ object_type: feature.featuretype, object_id: item.id }];

  switch (feature.featuretype) {
    case "tdta_leuchten":
      intermediateResultsToBeRemoved.push({
        object_type: "tdta_standort_mast",
        object_id: item?.fk_standort?.id,
      });
      intermediateResultsToBeRemoved.push({
        object_type: "tkey_leuchtentyp",
        object_id: item?.fk_leuchttyp?.id,
      });
      intermediateResultsToBeRemoved.push({
        object_type: "tkey_masttyp",
        object_id: item?.fk_standort?.fk_masttyp?.id,
      });

      break;
    case "Leitung":
    case "leitung":
      // nothing to do
      break;
    case "mauerlasche":
      // nothing to do
      break;
    case "schaltstelle":
      if (item?.rundsteuerempfaenger) {
        intermediateResultsToBeRemoved.push({
          object_type: "rundsteuerempfaenger",
          object_id: item?.rundsteuerempfaenger?.id,
        });
      }

      break;
    case "abzweigdose":
      // nothing to do
      break;
    case "tdta_standort_mast":
      intermediateResultsToBeRemoved.push({
        object_type: "tkey_masttyp",
        object_id: item?.fk_masttyp?.id,
      });
      break;
    default:
  }
  return intermediateResultsToBeRemoved;
};

export const integrateIntermediateResults = (feature, intermediateResults) => {
  console.log("xxx integrateIntermediateResults", feature, intermediateResults);

  const item = feature.properties;
  let docs = [];
  //remove intermediate results in item.docs
  if (item.docs) {
    item.docs = item.docs.filter((doc) => !doc.intermediate);
  }

  docs = getIntermediateResultsImages(item, intermediateResults, feature.featuretype.toLowerCase());
  switch (feature.featuretype) {
    case "tdta_leuchten":
      //docs

      docs = [
        ...docs,
        ...getIntermediateResultsImages(
          item?.fk_standort,
          intermediateResults,
          "tdta_standort_mast"
        ),
      ];
      docs = [
        ...docs,
        ...getIntermediateResultsImages(
          item?.fk_leuchttyp,
          intermediateResults,
          "tkey_leuchtentyp"
        ),
      ];
      docs = [
        ...docs,
        ...getIntermediateResultsImages(
          item?.fk_standort?.tkey_masttyp,
          intermediateResults,
          "tkey_masttyp"
        ),
      ];
      break;
    case "Leitung":
    case "leitung":
      break;
    case "mauerlasche":
      break;
    case "schaltstelle":
      docs.concat(
        getIntermediateResultsImages(
          item?.rundsteuerempfaenger,
          intermediateResults,
          "Rundsteuerempfänger"
        )
      );

      break;
    case "abzweigdose":
      item.docs.concat(docs);
      break;
    case "tdta_standort_mast":
      docs.concat(
        getIntermediateResultsImages(item?.tkey_masttyp, intermediateResults, "tkey_masttyp")
      );

      break;
    default:
  }
  if (item.docs) {
    item.docs = [...item.docs, ...docs];
  } else {
    item.docs = docs;
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

        case "schaltstelle":
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

export const getFachobjektOfProtocol = (item) => {
  if (item.tdta_leuchten) {
    return {
      ...item.tdta_leuchten,

      type: "tdta_leuchten",
      shortname:
        item.tdta_leuchten?.fk_leuchttyp?.leuchtentyp +
        "-" +
        item.tdta_leuchten.leuchtennummer +
        ", " +
        item.tdta_leuchten.lfd_nummer,
    };
  } else if (item.tdta_standort_mast) {
    return {
      ...item.tdta_standort_mast,
      type: "tdta_standort_mast",
      shortname: "Mast - " + item.tdta_standort_mast.lfd_nummer,
    };
  } else if (item.leitung) {
    const laengePart =
      item.leitung?.geom !== undefined
        ? Math.round(calcLength(item.leitung?.geom.geo_field) * 100) / 100 + "m"
        : "?m";
    return {
      ...item.leitung,
      type: "leitung",
      shortname: item.leitung.fk_leitungstyp.bezeichnung + " - " + laengePart,
    };
  } else if (item.schaltstelle) {
    return {
      ...item.schaltstelle,
      type: "schaltstelle",
      shortname:
        item.schaltstelle.fk_bauart.bezeichnung + " - " + item.schaltstelle.schaltstellen_nummer,
    };
  } else if (item.abzweigdose) {
    return { ...item.abzweigdose, type: "abzweigdose", shortname: "AZD - " + item.abzweigdose.id };
  } else if (item.mauerlasche) {
    return {
      ...item.mauerlasche,
      type: "mauerlasche",
      shortname: "M - " + item.mauerlasche.laufende_nummer,
    };
  } else if (item.geometrie) {
    return {
      ...item.geometrie,
      type: "geom",
      shortname: "FG - " + item.geometrie.bezeichnung,
    };
  }
};
