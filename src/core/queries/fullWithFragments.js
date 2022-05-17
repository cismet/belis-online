const queries = {};
export const geomFactories = {};
export const fragments = [];
const defaultGeomFactory = (object) => object.geom.geo_field;

fragments.push(`
    fragment dmsurlfields on dms_url {
        description
        url {
        object_name
        url_base {
            path
            prot_prefix
            server
        }
        }
    }
`);

fragments.push(`
fragment standortfields on tdta_standort_mast {
    inbetriebnahme_mast
    letzte_aenderung
    id
    verrechnungseinheit
    standortangabe
    plz
    anbauten
    elek_pruefung
    revision
    standsicherheitspruefung
    lfd_nummer
    montagefirma
    is_deleted
    anstrichfarbe
    monteur
    bemerkungen
    gruendung
    verfahren
    erdung
    haus_nr
    naechstes_pruefdatum
    mastanstrich
    mastschutz
    ist_virtueller_standort
    geom {
        geo_field
      }
    fk_kennziffer: tkey_kennziffer {
      id
      beschreibung
      kennziffer
    }
    anlagengruppe: anlagengruppeObject {
      nummer
      bezeichnung
    }
    fk_stadtbezirk: tkey_bezirk {
      id
      bezirk
      pk
    }
    fk_klassifizierung: tkey_klassifizierung {
      id
      klassifizierung
      pk
    }
    fk_masttyp: tkey_masttyp {
      bezeichnung
      dms_url {
        ...dmsurlfields
      }
      dokumenteArray {
        dms_url {
           ...dmsurlfields
        }
        id
        tkey_masttyp
      }
      foto
      hersteller
      id
      lph
      masttyp
      wandstaerke
    }
    fk_mastart: tkey_mastart {
      id
      pk
      mastart
    }
    fk_unterhaltspflicht_mast: tkey_unterh_mast {
      id
      pk
      unterhalt_mast
    }
    fk_strassenschluessel: tkey_strassenschluessel {
      id
      pk
      strasse
    }
  }
`);

queries.abzweigdose = `
    abzweigdose(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
        id
        is_deleted
        geom {
          geo_field
        }
        dokumenteArray(where: {}) {
        dms_url {
          ...dmsurlfields
        }
        }
    }
`;
geomFactories.abzweigdose = defaultGeomFactory;

queries.leitung = `
    leitung(where: {geom: {geo_field: {_st_intersects: $bbPoly}}})  {
        geom {
        geo_field
        }
        fk_leitungstyp: leitungstyp {
        id
        bezeichnung
        }
        fk_material : material_leitung {
        id
        bezeichnung
        }
        fk_querschnitt : querschnitt{
            id
            groesse
        }
        id
        is_deleted
        dokumenteArray {
        dms_url {
            ...dmsurlfields
        }
        }
    }
  `;
geomFactories.leitung = defaultGeomFactory;

queries.mauerlasche = `
    mauerlasche(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
      bemerkung
      dokumenteArray {
        dms_url {
          ...dmsurlfields
        }
      }
      erstellungsjahr
      foto
      fk_strassenschluessel: tkey_strassenschluessel {
        id
        pk
        strasse
      }
      fk_material: material_mauerlasche{
        id
        bezeichnung
      }
      id
      is_deleted
      laufende_nummer
      monteur
      pruefdatum
      geom {
        geo_field
      }
    }
  
  `;
geomFactories.mauerlasche = defaultGeomFactory;

queries.schaltstelle = `
schaltstelle(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
    bemerkung
    dokumenteArray {
      dms_url {
          ...dmsurlfields
      }
      id
    }
    dms_url {
      ...dmsurlfields
    }
    einbaudatum_rs
    erstellungsjahr
    fk_bauart: bauart {
      id
      bezeichnung
    }
    
    foto
    fk_strassenschluessel: tkey_strassenschluessel {
      id
      pk
      strasse
    }
    haus_nummer
    id
    is_deleted
    laufende_nummer
    monteur
    pruefdatum
    rundsteuerempfaenger: rundsteuerempfaengerObject  {
      id
      anschlusswert
      dms_url {
        ...dmsurlfields
      }
      foto
      herrsteller_rs
      programm
      rs_typ
    }
    schaltstellen_nummer
    zusaetzliche_standortbezeichnung
    geom {
      geo_field
    }
  }

  `;
geomFactories.schaltstelle = defaultGeomFactory;

queries.tdta_leuchten = `
tdta_leuchten(where: {tdta_standort_mast: {geom: {geo_field: {_st_intersects: $bbPoly}}}}) {
    id
    leuchtennummer
    plz
    einbaudatum
    anschlussleistung_1dk
    vorschaltgeraet
    anschlussleistung_2dk
    schaltstelle
    anzahl_1dk
    anzahl_2dk
    lfd_nummer
    is_deleted
    wartungszyklus
    lebensdauer
    monteur
    naechster_wechsel
    wechselvorschaltgeraet
    wechseldatum
    zaehler
    montagefirma_leuchte
    inbetriebnahme_leuchte
    bemerkungen
    rundsteuerempfaenger: rundsteuerempfaengerObject {
      id
      anschlusswert
      dms_url {
        ...dmsurlfields
      }
      foto
      herrsteller_rs
      programm
      rs_typ
    }
    fk_strassenschluessel: tkey_strassenschluessel {
      id
      pk
      strasse
    }
    fk_kennziffer: tkey_kennziffer {
      id
      beschreibung
      kennziffer
    }
    fk_leuchttyp: tkey_leuchtentyp {
      bestueckung
      dokumenteArray {
        dms_url {
            ...dmsurlfields
        }
        tkey_leuchtentyp_reference
        id
      }
      dms_url {
        ...dmsurlfields
      }
      vorschaltgeraet
      typenbezeichnung
      leuchtentyp
      leistung_reduziert
      leistung_brutto_reduziert
      leistung_brutto
      leistung2stufe
      leistung
      lampe
      id
      foto
      fabrikat
      einbau_vorschaltgeraet
    }
    fk_unterhaltspflicht_leuchte: tkey_unterh_leuchte {
      id
      pk
      unterhaltspflichtiger_leuchte
    }
    fk_energielieferant: tkey_energielieferant{
       id
      pk
      energielieferant
    }
    leuchtmittel:leuchtmittelObject {
       id
      hersteller
      lichtfarbe
    }
    
    fk_standort: tdta_standort_mast {
      ...standortfields
    }   
  }
`;
geomFactories.tdta_leuchten = (o) => o.tdta_standort_mast.geom.geo_field;

queries.tdta_standort_mast = `
tdta_standort_mast(where: {_and: {_not: {leuchtenArray: {}}}, geom: {geo_field: {_st_intersects: $bbPoly}}}) {
    ...standortfields    
  }  
`;
geomFactories.tdta_standort_mast = defaultGeomFactory;

export default queries;