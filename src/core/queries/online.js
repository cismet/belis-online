const queries = {};
export const geomFactories = {};
const defaultGeomFactory = (object) => object.geom.geo_field;
queries.abzweigdose = `
    abzweigdose(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
        id
        geom {
        geo_field
        }
        dokumenteArray(where: {}) {
        dms_url {
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
        }
    }
`;
geomFactories.abzweigdose = defaultGeomFactory;

queries.leitung = `
    leitung(where: {geom: {geo_field: {_st_intersects: $bbPoly}}})  {
      geom {
        geo_field
      }
      fk_leitungstyp
      fk_material
      fk_querschnitt
      id
      dokumenteArray {
        dms_url {
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
      }
    }
  `;
geomFactories.leitung = defaultGeomFactory;

queries.mauerlasche = `
    mauerlasche(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
      bemerkung
      dokumenteArray {
        dms_url {
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
      }
      erstellungsjahr
      foto
      fk_strassenschluessel
      fk_material
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
        id
      }
      dms_url {
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
      einbaudatum_rs
      erstellungsjahr
      fk_bauart
      
      foto
      fk_strassenschluessel
      haus_nummer
      id
      is_deleted
      laufende_nummer
      monteur
      pruefdatum
      rundsteuerempfaenger
      schaltstellen_nummer
      zusaetzliche_standortbezeichnung
      geom {
        geo_field
      }
    }
  
  `;
geomFactories.schaltstelle = defaultGeomFactory;

queries.tdta_leuchten_ohne_mast = `
tdta_leuchten(where: {tdta_standort_mast: {geom: {geo_field: {_st_intersects: $bbPoly}}}}) {
    leuchtennummer
    anschlussleistung_1dk
    anschlussleistung_2dk
    anzahl_1dk
    anzahl_2dk
    bemerkungen
    dokumenteArray {
      dms_url {
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
    }
    einbaudatum
    fk_dk1
    fk_dk2
    fk_energielieferant
    fk_kennziffer
    fk_leuchttyp
    fk_strassenschluessel
    fk_unterhaltspflicht_leuchte
    fk_standort
    id
    inbetriebnahme_leuchte
    is_deleted
    kabeluebergangskasten_sk_ii
    lebensdauer
    leuchtmittel
    lfd_nummer
    montagefirma_leuchte
    monteur
    naechster_wechsel
    plz
    rundsteuerempfaenger
    schaltstelle
    vorschaltgeraet
    wartungszyklus
    wechseldatum
    wechselvorschaltgeraet
    zaehler
    tdta_standort_mast {
      geom {
        geo_field
      }
    }
  }
`;

queries.tdta_leuchten = `
tdta_leuchten(where: {tdta_standort_mast: {geom: {geo_field: {_st_intersects: $bbPoly}}}}) {
    leuchtennummer
    anschlussleistung_1dk
    anschlussleistung_2dk
    anzahl_1dk
    anzahl_2dk
    bemerkungen
    dokumenteArray {
      dms_url {
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
    }
    einbaudatum
    fk_dk1
    fk_dk2
    fk_energielieferant
    fk_kennziffer
    fk_leuchttyp
    fk_strassenschluessel
    fk_unterhaltspflicht_leuchte
    fk_standort
    id
    inbetriebnahme_leuchte
    is_deleted
    kabeluebergangskasten_sk_ii
    lebensdauer
    leuchtmittel
    lfd_nummer
    montagefirma_leuchte
    monteur
    naechster_wechsel
    plz
    rundsteuerempfaenger
    schaltstelle
    vorschaltgeraet
    wartungszyklus
    wechseldatum
    wechselvorschaltgeraet
    zaehler
    tdta_standort_mast {
      geom {
        geo_field
      }
    }



    full_tdta_standort_mast: tdta_standort_mast {
      id
      bemerkungen
      anstrichfarbe
      dokumenteArray {
        dms_url {
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
      }
      elek_pruefung
      erdung
      fk_kennziffer
      fk_klassifizierung
      fk_mastart
      fk_masttyp
      fk_stadtbezirk
      fk_strassenschluessel
      fk_unterhaltspflicht_mast
      foto
      gruendung
      haus_nr
      inbetriebnahme_mast
      ist_virtueller_standort
      letzte_aenderung
      lfd_nummer
      mastanstrich
      mastschutz
      montagefirma
      monteur
      naechstes_pruefdatum
      plz
      revision
      standortangabe
      standsicherheitspruefung
      verfahren
      verrechnungseinheit
      anbauten
      anlagengruppeObject {
        nummer
        bezeichnung
      }
      geom {
        geo_field
      }
    }
  }
`;
geomFactories.tdta_leuchten = (o) => o.tdta_standort_mast.geom.geo_field;

queries.tdta_standort_mast = `
tdta_standort_mast(where: {_and: {_not: {leuchtenArray: {}}}, geom: {geo_field: {_st_intersects: $bbPoly}}}) {
    id
    bemerkungen
    anstrichfarbe
    dokumenteArray {
      dms_url {
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
    }
    elek_pruefung
    erdung
    fk_kennziffer
    fk_klassifizierung
    fk_mastart
    fk_masttyp
    fk_stadtbezirk
    fk_strassenschluessel
    fk_unterhaltspflicht_mast
    foto
    gruendung
    haus_nr
    inbetriebnahme_mast
    ist_virtueller_standort
    letzte_aenderung
    lfd_nummer
    mastanstrich
    mastschutz
    montagefirma
    monteur
    naechstes_pruefdatum
    plz
    revision
    standortangabe
    standsicherheitspruefung
    verfahren
    verrechnungseinheit
    anbauten
    anlagengruppeObject {
      nummer
      bezeichnung
    }
    geom {
      geo_field
    }
  }  
`;
geomFactories.tdta_standort_mast = defaultGeomFactory;

export default queries;
