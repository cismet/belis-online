import uuidv4 from "uuid/v4";
import { getDate } from "../../../../components/commons/secondaryinfo/components/helper";

import { getJWT, getLoginFromJWT } from "../auth";
import { getLeuchtentypenKT, getLeuchtmittelKT, getRundsteuerempfaengerKT } from "../keytables";
import { addIntermediateResult, getDB } from "../offlineActionDb";

const protocolAction = (params, item) => {
  return async (dispatch, getState) => {
    const state = getState();
    const offlineActionDb = getDB(state);
    const jwt = getJWT(state);
    const login = getLoginFromJWT(jwt);
    const ccnonce = Math.random() * 10000000000;
    const paramsWithCCNonce = { ...params, ccnonce };
    const keytablesState = state.keytables;
    const leuchtmittelKT = getLeuchtmittelKT(keytablesState);
    const leuchtenTypKT = getLeuchtentypenKT(keytablesState);
    const rundsteuerempfaengerKT = getRundsteuerempfaengerKT(keytablesState);
    const getLeuchtmittel = (id) => {
      return leuchtmittelKT.find((item) => item.id === id);
    };
    const getLeuchtenTyp = (id) => {
      return leuchtenTypKT.find((item) => item.id === id);
    };
    const getRundsteuerempfaenger = (id) => {
      return rundsteuerempfaengerKT.find((item) => item.id === id);
    };

    const offlineAction = {
      id: uuidv4(),
      action: paramsWithCCNonce.actionname,
      jwt: jwt,
      parameter: JSON.stringify(paramsWithCCNonce),
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      applicationId: login + "@belis",
    };

    offlineActionDb.actions.insert(offlineAction);

    console.log("protocolAction paramsWithCCNonce", paramsWithCCNonce);

    console.log("added object to offline db to addIncident", paramsWithCCNonce, offlineAction);
    let intermediateResult4Prot = {
      object_type: "arbeitsprotokoll",
      object_id: paramsWithCCNonce.protokoll_id,
      data: {
        ...paramsWithCCNonce,
        protokollAktionArray: [],
      },
      ts: paramsWithCCNonce.ts,
      action: paramsWithCCNonce.actionname,
      resultType: "object",
    };
    switch (paramsWithCCNonce.actionname) {
      case "protokollStatusAenderung":
        //nothing else to do
        break;
      case "protokollLeuchteLeuchtenerneuerung":
        const leuchtenTyp = getLeuchtenTyp(paramsWithCCNonce.leuchtentyp);
        const leuchtenTypBezeichnung = leuchtenTyp.leuchtentyp + " - " + leuchtenTyp.fabrikat;
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Inbetriebnahme*",
          alt: item.inbetriebnahme_leuchte,
          neu: getDate(paramsWithCCNonce.inbetriebnahmedatum),
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Leuchtentyp*",
          alt: item.fk_leuchttyp,
          neu: leuchtenTypBezeichnung,
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_leuchten",
            item.tdta_leuchten.id,
            {
              inbetriebnahme_leuchte: new Date(paramsWithCCNonce.inbetriebnahmedatum).toISOString(),
              fk_leuchttyp: getLeuchtenTyp(paramsWithCCNonce.leuchtentyp),
            },
            paramsWithCCNonce
          )
        );

        break;
      case "protokollLeuchteLeuchtmittelwechselElekpruefung":
        const leuchtmittel = getLeuchtmittel(paramsWithCCNonce.leuchtmittel);
        const leuchtmittelBezeichung = leuchtmittel.hersteller + " " + leuchtmittel.lichtfarbe;
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Wechseldatum*",
          alt: item.wechseldatum,
          neu: getDate(paramsWithCCNonce.wechseldatum),
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Lebensdauer*",
          alt: item.lebensdauer,
          neu: paramsWithCCNonce.lebensdauer,
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Leuchtmittel*",
          alt: item.leuchtmittel,
          neu: leuchtmittelBezeichung,
          ccnonce,
        });

        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Elektrische Prüfung*",
          alt: item.tdta_leuchten.fk_standort.elek_pruefung,
          neu: getDate(paramsWithCCNonce.pruefdatum),
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Erdung in Ordnung*",
          alt: item.tdta_leuchten.fk_standort.erdung,
          neu: paramsWithCCNonce.erdung_in_ordnung,
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_leuchten",
            item.tdta_leuchten.id,
            {
              leuchtmittel: getLeuchtmittel(paramsWithCCNonce.leuchtmittel),
              wechseldatum: new Date(paramsWithCCNonce.wechseldatum).toISOString(),
              lebensdauer: paramsWithCCNonce.lebensdauer,
            },
            paramsWithCCNonce
          )
        );

        if (item.tdta_leuchten.fk_standort) {
          dispatch(
            addMoreIntermediateResults(
              "tdta_standort_mast",
              item.tdta_leuchten.fk_standort.id,
              {
                elek_pruefung: new Date(paramsWithCCNonce.pruefdatum).toISOString(),
                erdung: paramsWithCCNonce.erdung,
              },
              paramsWithCCNonce
            )
          );
        }
        break;
      case "protokollLeuchteLeuchtmittelwechsel":
        const leuchtmittel2 = getLeuchtmittel(paramsWithCCNonce.leuchtmittel);
        const leuchtmittelBezeichung2 = leuchtmittel2.hersteller + " " + leuchtmittel2.lichtfarbe;
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Wechseldatum*",
          alt: item.wechseldatum,
          neu: getDate(paramsWithCCNonce.wechseldatum),
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Lebensdauer*",
          alt: item.lebensdauer,
          neu: paramsWithCCNonce.lebensdauer,
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Leuchtmittel*",
          alt: item.leuchtmittel,
          neu: leuchtmittelBezeichung2,
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_leuchten",
            item.tdta_leuchten.id,

            {
              leuchtmittel: getLeuchtmittel(paramsWithCCNonce.leuchtmittel),
              wechseldatum: new Date(paramsWithCCNonce.wechseldatum).toISOString(),
              lebensdauer: paramsWithCCNonce.lebensdauer,
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollLeuchteRundsteuerempfaengerwechsel":
        const rs = getRundsteuerempfaenger(paramsWithCCNonce.rundsteuerempfaenger);
        const rundsteuerempfaengerBezeichungAlt =
          (item.rundsteuerempfaenger?.herrsteller_rs || "ohne Hersteller") +
          " - " +
          item.rundsteuerempfaenger?.rs_typ;
        const rundsteuerempfaengerBezeichung =
          (rs.herrsteller_rs || "ohne Hersteller") + " - " + rs.rs_typ;
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Einbaudatum*",
          alt: item.einbaudatum,
          neu: getDate(paramsWithCCNonce.einbaudatum),
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Rundsteuerempfänger*",
          alt: item.rundsteuerempfaenger ? rundsteuerempfaengerBezeichungAlt : undefined,
          neu: rundsteuerempfaengerBezeichung,
          ccnonce,
        });
        //params.einbaudatum
        //params.rundsteuerempfaenger
        dispatch(
          addMoreIntermediateResults(
            "tdta_leuchten",
            item.tdta_leuchten.id,
            {
              einbaudatum: new Date(paramsWithCCNonce.einbaudatum).toISOString(),
              rundsteuerempfaenger: rs,
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollLeuchteSonderturnus":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Sonderturnus*",
          alt: item.wartungszyklus,
          neu: getDate(paramsWithCCNonce.sonderturnusdatum),
          ccnonce,
        });

        //params.sonderturnusdatum
        dispatch(
          addMoreIntermediateResults(
            "tdta_leuchten",
            item.tdta_leuchten.id,
            {
              wartungszyklus: new Date(paramsWithCCNonce.sonderturnusdatum).toISOString(),
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollLeuchteVorschaltgeraetwechsel":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Erneuerung Vorschaltgerät*",
          alt: item.wechselvorschaltgeraet,
          neu: getDate(paramsWithCCNonce.wechseldatum),
          ccnonce,
        });

        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Vorschaltgerät*",
          alt: item.vorschaltgeraet,
          neu: paramsWithCCNonce.vorschaltgeraet,
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_leuchten",
            item.tdta_leuchten.id,
            {
              wechselvorschaltgeraet: new Date(paramsWithCCNonce.wechseldatum).toISOString(),
              vorschaltgeraet: paramsWithCCNonce.vorschaltgeraet,
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollStandortAnstricharbeiten":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Mastanstrich*",
          alt: item.mastanstrich,
          neu: getDate(paramsWithCCNonce.anstrichdatum),
          ccnonce,
        });

        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Anstrichfarbe*",
          alt: item.anstrichfarbe,
          neu: paramsWithCCNonce.anstrichfarbe,
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_standort_mast",
            item.tdta_leuchten?.fk_standort?.id || item.tdta_standort_mast?.id,
            {
              mastanstrich: new Date(paramsWithCCNonce.anstrichdatum).toISOString(),
              anstrichfarbe: paramsWithCCNonce.anstrichfarbe,
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollStandortElektrischePruefung":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Elektrische Prüfung*",
          alt: item.elek_pruefung,
          neu: getDate(paramsWithCCNonce.pruefdatum),
          ccnonce,
        });

        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Erdung in Ordnung*",
          alt: item.erdung,
          neu: paramsWithCCNonce.erdung_in_ordnung,
          ccnonce,
        });

        //params.pruefdatum
        //params.erdung_in_ordnung
        dispatch(
          addMoreIntermediateResults(
            "tdta_standort_mast",
            item.tdta_leuchten?.fk_standort?.id || item.tdta_standort_mast?.id,

            {
              elek_pruefung: new Date(paramsWithCCNonce.pruefdatum).toISOString(),
              erdung: paramsWithCCNonce.erdung,
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollStandortMasterneuerung":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Inbetriebnahme*",
          alt: item.inbetriebnahme_mast,
          neu: getDate(paramsWithCCNonce.inbetriebnahmedatum),
          ccnonce,
        });

        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Montagefirma*",
          alt: item.montagefirma,
          neu: paramsWithCCNonce.montagefirma,
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Standsicherheitsprüfung*",
          alt: item.standsicherheitspruefung,
          neu: null,
          ccnonce,
        });

        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Verfahren*",
          alt: item.verfahren,
          neu: null,
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Nächstes Prüfdatum*",
          alt: item.naechstes_pruefdatum,
          neu: null,
          ccnonce,
        });

        //params.inbetriebnahmedatum
        //params.montagefirma
        dispatch(
          addMoreIntermediateResults(
            "tdta_standort_mast",
            item.tdta_leuchten?.fk_standort?.id || item.tdta_standort_mast?.id,
            {
              inbetriebnahme_mast: new Date(paramsWithCCNonce.inbetriebnahmedatum).toISOString(),
              montagefirma: paramsWithCCNonce.montagefirma,
              standsicherheitspruefung: null,
              verfahren: null,
              naechstes_pruefdatum: null,
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollStandortRevision":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Revision*",
          alt: item.revision,
          neu: getDate(paramsWithCCNonce.revisionsdatum),
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_standort_mast",
            item.tdta_leuchten?.fk_standort?.id || item.tdta_standort_mast?.id,

            {
              revision: new Date(paramsWithCCNonce.revisionsdatum).toISOString(),
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollStandortStandsicherheitspruefung":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Standsicherheitsprüfung*",
          alt: item.standsicherheitspruefung,
          neu: getDate(paramsWithCCNonce.pruefdatum),
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Verfahren*",
          alt: item.verfahren,
          neu: paramsWithCCNonce.verfahren,
          ccnonce,
        });
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Nächstes Prüfdatum*",
          alt: item.naechstes_pruefdatum,
          neu: getDate(paramsWithCCNonce.naechstes_pruefdatum),
          ccnonce,
        });

        dispatch(
          addMoreIntermediateResults(
            "tdta_standort_mast",
            item.tdta_leuchten?.fk_standort?.id || item.tdta_standort_mast?.id,

            {
              standsicherheitspruefung: new Date(paramsWithCCNonce.pruefdatum).toISOString(),
              verfahren: paramsWithCCNonce.verfahren,
              naechstes_pruefdatum: new Date(paramsWithCCNonce.naechstes_pruefdatum).toISOString(),
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollMauerlaschePruefung":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Prüfdatum*",
          alt: item.pruefdatum,
          neu: getDate(paramsWithCCNonce.pruefdatum),
          ccnonce,
        });

        //params.pruefdatum
        dispatch(
          addMoreIntermediateResults(
            "mauerlasche",
            item.mauerlasche.id,
            {
              pruefdatum: new Date(paramsWithCCNonce.pruefdatum).toISOString(),
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollSchaltstelleRevision":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Prüfdatum*",
          alt: item.pruefdatum,
          neu: getDate(paramsWithCCNonce.pruefdatum),
          ccnonce,
        });

        //params.pruefdatum
        dispatch(
          addMoreIntermediateResults(
            "schaltstelle",
            item.schaltstelle.id,
            {
              pruefdatum: new Date(paramsWithCCNonce.pruefdatum).toISOString(),
            },
            paramsWithCCNonce
          )
        );
        break;
      case "protokollFortfuehrungsantrag":
        intermediateResult4Prot.data.protokollAktionArray.push({
          aenderung: "Sonstiges*",
          alt: null,
          neu: paramsWithCCNonce.bemerkung,
          ccnonce,
        });

        //no further intermediate results
        break;

      default:
    }
    dispatch(addIntermediateResult(intermediateResult4Prot));
  };
};

const addMoreIntermediateResults = (type, id, data, params) => {
  return async (dispatch, getState) => {
    const intermediateResults = {
      object_type: type,
      object_id: id,
      data,
      ts: params.ts,
      action: params.actionname,
      resultType: "object",
    };
    dispatch(addIntermediateResult(intermediateResults));
  };
};

export default protocolAction;
