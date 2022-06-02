const queries = {};
export const geomFactories = {};
const defaultGeomFactory = (object) => object.geom.geo_field;
queries.abzweigdose = `
    abzweigdose(where: {geom: {geo_field: {_st_intersects: $bbPoly}}}) {
        id
        is_deleted
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
      is_deleted
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
      is_deleted
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
    is_deleted
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

queries.arbeitsauftraegexx = `

  arbeitsauftrag(where: 
    {_and: [
      
      {team: {id: {_eq: $teamId}}} ,
      {_or:[
        {is_deleted:{_is_null:true}},
        {is_deleted:{_eq:false}}
      ]},
     {_or:[
      {ar_protokolleArray:{arbeitsprotokoll:{fk_status:{_is_null:true}}}},
      {ar_protokolleArray:{arbeitsprotokoll:{arbeitsprotokollstatus:{schluessel:{_eq:"0"}}}}},
        
        ]}
    ]}
      ) {
    angelegt_am
    angelegt_von
    id
    is_deleted
    nummer
    zugewiesen_an
    team {
      id
    }
     ar_protokolleArray {
      arbeitsprotokoll {
        id
        veranlassungsnummer
        protokollnummer
        is_deleted
        material
        monteur
        bemerkung
        defekt
        datum
        arbeitsprotokollstatus {
          bezeichnung
          schluessel
        }
        geometrie {
          geom {
            geo_field
          }
        } 
        tdta_leuchten {
          tdta_standort_mast {
            geom {
              geo_field
            }
          }   
        }
        tdta_standort_mast {
          geom {
            geo_field
          }
        }
        schaltstelle {
          geom {
            geo_field
          }
        }
        mauerlasche {
          geom {
            geo_field
          }
        }
        leitung {
          geom {
            geo_field
          }
        }
        abzweigdose {
          geom {
            geo_field
          }
        }
      }
    }
  
  }



`;

queries.singleArbeitsauftragFull = `
arbeitsauftrag(where: {id: {_eq: $aaId}}) {
  angelegt_am
  angelegt_von
  id
  is_deleted
  nummer
  zugewiesen_an
  team {
    id
  }
  ar_protokolleArray {
    arbeitsprotokoll {
      id
      veranlassungsnummer
      veranlassung {
        id
        nummer
        bezeichnung
        veranlassungsart {
          bezeichnung
          schluessel
        }
        beschreibung
        username
        datum
        bemerkungen
      }
      protokollnummer
      is_deleted
      material
      monteur
      bemerkung
      defekt
      datum
      arbeitsprotokollstatus {
        bezeichnung
        schluessel
      }
      geometrie {
        bezeichnung
        geom {
          geo_field
        }
      }
      tdta_leuchten {
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
        rundsteuerempfaenger: rundsteuerempfaengerObject {
          id
          anschlusswert
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
            tkey_leuchtentyp_reference
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
        fk_energielieferant: tkey_energielieferant {
          id
          pk
          energielieferant
        }
        leuchtmittel: leuchtmittelObject {
          id
          hersteller
          lichtfarbe
        }
        tdta_standort_mast {
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
          fk_masttyp: tkey_masttyp {
            bezeichnung
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
      }
      tdta_standort_mast {
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
      schaltstelle {
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
        foto: dms_url {
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
        fk_bauart: bauart {
          id
          bezeichnung
        }
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
        rundsteuerempfaenger: rundsteuerempfaengerObject {
          id
          anschlusswert
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
      mauerlasche {
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
        fk_strassenschluessel: tkey_strassenschluessel {
          id
          pk
          strasse
        }
        fk_material: material_mauerlasche {
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
      leitung {
        geom {
          geo_field
        }
        fk_leitungstyp: leitungstyp {
          id
          bezeichnung
        }
        fk_material: material_leitung {
          id
          bezeichnung
        }
        fk_querschnitt: querschnitt {
          id
          groesse
        }
        id
        is_deleted
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
      abzweigdose {
        id
        is_deleted
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
    }
  }
}

`;
export default queries;
