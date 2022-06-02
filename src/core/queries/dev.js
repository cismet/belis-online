const queries = {};

queries.arbeitsauftrag = `query Arbeitsauftraege {

    arbeitsauftrag(where: 
      {_and: [
        
        {team: {name: {_eq: "Störungsbeseitigung"}}} ,
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
  }
  
  
  `;

queries.allarbeitsauftragfull1 = `query Arbeitsauftraege {
    
  arbeitsauftrag(where: 
    {_and: [
      
      {team: {name: {_eq: "Störungsbeseitigung"}}} ,
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
        fk_standort: tdta_standort_mast {
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
}
  `;

const singleAAFull = `
query Arbeitsauftraege {
    
  arbeitsauftrag(where: 
    {_and: [
      
      {team: {name: {_eq: "Störungsbeseitigung"}}} ,
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
        fk_standort: tdta_standort_mast {
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
}
`;

const queryArbeitsauftraegeOnlyWhere = `
query Arbeitsauftraege {

    arbeitsauftrag(where: 
     {_and: [
        {team: {name: {_eq: "Störungsbeseitigung"}}} ,
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
     
      nummer
      
    }
  }
  
`;

const queryArbeitsAuftraegeSingleId = `
query Arbeitsauftraege {

    arbeitsauftrag(where: 
      {id:{_eq:7489}}
        ) {
      angelegt_am
      angelegt_von
      id
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
          fk_status
          arbeitsprotokollstatus {
            bezeichnung
            schluessel
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
  }
  
`;
