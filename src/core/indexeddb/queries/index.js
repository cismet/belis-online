const queries = {};
queries.anlagengruppe = `{
    anlagengruppe {
      nummer
      id
      bezeichnung
    }
  }`;
queries.arbeitsprotokollstatus = `{
    arbeitsprotokollstatus {
      id
      bezeichnung
      schluessel
    }
  }
  `;
queries.bauart = `{
    bauart {
      id
      bezeichnung
    }
  }
  `;

queries.leitungstyp = `{
    leitungstyp {
      id
      bezeichnung
    }
  }
  `;
queries.leuchtmittel = `{
    leuchtmittel {
      id
      hersteller
      lichtfarbe
    }
  }
  `;
queries.material_leitung = `{
    material_leitung {
      bezeichnung
      id
    }
  }
  `;
queries.material_mauerlasche = `{
    material_mauerlasche {
      id
      bezeichnung
    }
  }
  `;
queries.querschnitt = `{
    querschnitt {
      id
      groesse
    }
  }
  `;
queries.team = `{
    team {
      id
     name
    }
  }
  `;
queries.tkey_bezirk = `{
    tkey_bezirk {
      id
      bezirk
      pk
    }
  }
  `;
queries.tkey_doppelkommando = `{
    tkey_doppelkommando {
      id
      beschreibung
      pk
    }
  }
  `;
queries.tkey_energielieferant = `{
    tkey_energielieferant {
      id
      pk
      energielieferant
    }
  }
  `;
queries.tkey_kennziffer = `{
    tkey_kennziffer {
      id
      beschreibung
      kennziffer
    }
  }
  `;
queries.tkey_klassifizierung = `{
    tkey_klassifizierung {
      id
      klassifizierung
      pk
    }
  }
  `;
queries.tkey_mastart = `{
    tkey_mastart {
      id
      pk
      mastart
    }
  }
  `;
queries.tkey_strassenschluessel = `{
    tkey_strassenschluessel {
      id
      pk
      strasse
    }
  }
  `;
queries.tkey_unterh_leuchte = `{
    tkey_unterh_leuchte {
      id
      pk
      unterhaltspflichtiger_leuchte
    }
  }
  `;
queries.tkey_unterh_mast = `{
    tkey_unterh_mast {
      id
      pk
      unterhalt_mast
    }
  }
  `;
queries.veranlassungsart = `{
    veranlassungsart {
      id
      bezeichnung
      schluessel
    }
  }
  `;

queries.rundsteuerempfaenger = `{
    rundsteuerempfaenger {
      id
      anschlusswert
      dms_url {
        url {
          url_base {
            path
            prot_prefix
            server
          }
          object_name
        }
      }
      foto
      herrsteller_rs
      programm
      rs_typ
    }
  }
  `;
queries.abzweigdose = `{
    abzweigdose {
        id
       
        dokumenteArray {
            dms_url {
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
}`;
queries.tkey_leuchtentyp = `{
    tkey_leuchtentyp {
      bestueckung
      dokumenteArray {
        dms_url {
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
  }
  
  `;
queries.tkey_masttyp = `{
    tkey_masttyp {
      bezeichnung
      dms_url {
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
  }
  
  `;
queries.leitung = `{
    leitung {
      geom {
        geo_field
      }
      fk_leitungstyp
      fk_material
      fk_querschnitt
      id
      dokumenteArray {
        dms_url {
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
  `;
queries.mauerlasche = `{
    mauerlasche {
      bemerkung
      dokumenteArray {
        dms_url {
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
    }
  }
  `;
queries.schaltstelle = `{
    schaltstelle {
      bemerkung
      dokumenteArray {
        dms_url {
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
    }
  }
  `;
queries.tdta_leuchten = `{
    tdta_leuchten {
        leuchtennummer
        anschlussleistung_1dk
        anschlussleistung_2dk
        anzahl_1dk
        anzahl_2dk
        bemerkungen
        dokumenteArray {
            dms_url {
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
    }
}`;
queries.tdta_standort_mast = `{
    tdta_standort_mast {
        id
        bemerkungen
        anstrichfarbe
        dokumenteArray {
            dms_url {
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
    }
}`;

queries.raw_point_index = `{
    raw_point_index {
        id
        tablename
        x
        y
  }
}`;

//--------??
const queriesNotSure = {};
queriesNotSure.infobaustein = `{
    infobaustein {
      bezeichnung
      id
      pflichtfeld
      schluessel
      wert
    }
  }
  `;
queriesNotSure.arbeitsprotokollaktion = `{
    arbeitsprotokollaktion {
      id
      aenderung
      alt
      neu
      fk_protokoll
    }
  }
  `;
queriesNotSure.infobaustein_template = ``;

queriesNotSure.arbeitsauftrag = ``;

queriesNotSure.arbeitsprotokoll = ``;

queriesNotSure.veranlassung = ``;

export default queries;