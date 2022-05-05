const queries = {};

queries.arbeitsauftrag1 = `query Arbeitsauftraege {

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

queries.arbeitsauftragfull1 = `query Arbeitsauftraege {

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
            }          }
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
            }          }
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
const outputREST = {
  $self: "/BELIS2.ARBEITSAUFTRAG/6865",
  id: 6865,
  is_deleted: null,
  angelegt_von: "ViereckelF",
  angelegt_am: "2021-07-27",
  nummer: "00012081",
  ar_protokolle: [
    {
      $self: "/BELIS2.ARBEITSPROTOKOLL/75954",
      id: 75954,
      is_deleted: null,
      material: null,
      monteur: "Eck",
      bemerkung: "Kabel abgeleg Kabelfehler",
      defekt: null,
      datum: "2021-08-10",
      fk_status: {
        $self: "/BELIS2.ARBEITSPROTOKOLLSTATUS/1",
        id: 1,
        bezeichnung: "in Bearbeitung",
        schluessel: "0",
      },
      fk_standort: null,
      fk_mauerlasche: null,
      fk_leuchte: {
        $self: "/BELIS2.TDTA_LEUCHTEN/15735",
        id: 15735,
        is_deleted: null,
        plz: null,
        fk_strassenschluessel: {
          $self: "/BELIS2.TKEY_STRASSENSCHLUESSEL/1209",
          id: 1209,
          strasse: "KOSICE-UFER",
          pk: "01955",
        },
        fk_energielieferant: {
          $self: "/BELIS2.TKEY_ENERGIELIEFERANT/1",
          id: 1,
          energielieferant: "WSW",
          pk: 0,
        },
        rundsteuerempfaenger: {
          $self: "/BELIS2.RUNDSTEUEREMPFAENGER/14",
          id: 14,
          herrsteller_rs: null,
          rs_typ: "K - Kabel",
          anschlusswert: null,
          programm: null,
          foto: null,
        },
        fk_leuchttyp: {
          $self: "/BELIS2.TKEY_LEUCHTENTYP/13",
          id: 13,
          leuchtentyp: "L 13.1",
          bestueckung: 1.0,
          leistung: 42.0,
          leistung_brutto: 46.0,
          fabrikat: "Trilux Oberlichtlaterne 42W",
          lampe: "TC-TEL",
          leistung2stufe: null,
          vorschaltgeraet: null,
          einbau_vorschaltgeraet: null,
          leistung_reduziert: null,
          leistung_brutto_reduziert: null,
          foto: null,
          dokumente: [],
          typenbezeichnung: "Kompaktleuchtstofflampe",
        },
        fk_unterhaltspflicht_leuchte: {
          $self: "/BELIS2.TKEY_UNTERH_LEUCHTE/1",
          id: 1,
          unterhaltspflichtiger_leuchte: "Öffentl. Beleuchtung",
          pk: 0,
        },
        zaehler: false,
        fk_dk1: {
          $self: "/BELIS2.TKEY_DOPPELKOMMANDO/2",
          id: 2,
          beschreibung: "Ganznachtbetrieb",
          pk: "12",
        },
        fk_dk2: null,
        inbetriebnahme_leuchte: 886028400000,
        lfd_nummer: 16,
        anzahl_2dk: null,
        fk_kennziffer: {
          $self: "/BELIS2.TKEY_KENNZIFFER/1",
          id: 1,
          beschreibung: "Leuchte mit oder ohne Mast",
          kennziffer: 0,
        },
        leuchtennummer: 0,
        montagefirma_leuchte: "SAG",
        schaltstelle: "328",
        anzahl_1dk: 1,
        stadtbezirk: null,
        bemerkungen: null,
        dokumente: [],
        anschlussleistung_1dk: 46.0,
        anschlussleistung_2dk: null,
        kabeluebergangskasten_sk_ii: null,
        leuchtmittel: null,
        lebensdauer: 2.0,
        wechseldatum: 1605826800000,
        wartungszyklus: null,
        wechselvorschaltgeraet: null,
        monteur: null,
        naechster_wechsel: 1510614000000,
        vorschaltgeraet: null,
        einbaudatum: null,
        fk_standort: {
          $self: "/BELIS2.TDTA_STANDORT_MAST/15522",
          id: 15522,
          is_deleted: null,
          plz: null,
          fk_strassenschluessel: {
            $self: "/BELIS2.TKEY_STRASSENSCHLUESSEL/1209",
            id: 1209,
            strasse: "KOSICE-UFER",
            pk: "01955",
          },
          fk_stadtbezirk: {
            $self: "/BELIS2.TKEY_BEZIRK/1",
            id: 1,
            bezirk: "ELBERFELD",
            pk: 0,
          },
          fk_mastart: {
            $self: "/BELIS2.TKEY_MASTART/8",
            id: 8,
            mastart: "Stahlmast",
            pk: "S",
          },
          fk_klassifizierung: {
            $self: "/BELIS2.TKEY_KLASSIFIZIERUNG/2",
            id: 2,
            klassifizierung: "verzinkt (Stahlmast)",
            pk: 1,
          },
          mastanstrich: 1515538800000,
          mastschutz: 1643756400000,
          fk_unterhaltspflicht_mast: {
            $self: "/BELIS2.TKEY_UNTERH_MAST/1",
            id: 1,
            unterhalt_mast: "öffentl. Beleuchtung",
            pk: 0,
          },
          fk_masttyp: {
            $self: "/BELIS2.TKEY_MASTTYP/33",
            id: 33,
            masttyp: "M14",
            bezeichnung: "4m Aufsatzmast",
            lph: 4.0,
            hersteller: null,
            wandstaerke: null,
            dokumente: [
              {
                $self: "/BELIS2.DMS_URL/13",
                id: 13,
                typ: null,
                url_id: {
                  $self: "/BELIS2.URL/13",
                  id: 13,
                  url_base_id: {
                    $self: "/BELIS2.URL_BASE/13",
                    id: 13,
                    prot_prefix: "http://",
                    path: "/belis/",
                    server: "board.cismet.de",
                  },
                  object_name: "DOC-1396267579506-1070639412.pdf",
                },
                description: "M14.pdf",
                name: null,
              },
            ],
            foto: null,
          },
          inbetriebnahme_mast: 1515538800000,
          verrechnungseinheit: true,
          letzte_aenderung: 1643900918070,
          fk_geom: {
            $self: "/BELIS2.GEOM/9060",
            id: 9060,
            geo_field: "SRID=25832;POINT (371365.4729908834 5679789.558080757)",
            wgs84_wkt: "POINT (7.156617034337665 51.25493633464403)",
          },
          ist_virtueller_standort: null,
          bemerkungen: "",
          montagefirma: "SAG",
          standortangabe: "Fußweg Wupperufer, 2. Leuchte von Einm. Schauspielhaus",
          fk_kennziffer: {
            $self: "/BELIS2.TKEY_KENNZIFFER/1",
            id: 1,
            beschreibung: "Leuchte mit oder ohne Mast",
            kennziffer: 0,
          },
          lfd_nummer: 16,
          haus_nr: "000",
          dokumente: [],
          gruendung: null,
          elek_pruefung: 1605826800000,
          erdung: true,
          monteur: null,
          standsicherheitspruefung: 1648677600000,
          verfahren: "Reilux",
          foto: null,
          naechstes_pruefdatum: 1837980000000,
          anstrichfarbe: null,
          revision: null,
          anlagengruppe: {
            $self: "/BELIS2.ANLAGENGRUPPE/3",
            id: 3,
            nummer: 3,
            bezeichnung: "Anliegerstr. - Leuchte u. Mast (LPH bis 6m)",
          },
          anbauten: null,
        },
      },
      fk_leitung: null,
      fk_abzweigdose: null,
      fk_schaltstelle: null,
      fk_geometrie: null,
      veranlassungsnummer: "00016155",
      veranlassungsschluessel: null,
      protokollnummer: 1,
      n_aktionen: [],
    },
  ],
  zugewiesen_an: {
    $self: "/BELIS2.TEAM/27",
    id: 27,
    name: "Störungsbeseitigung",
  },
  ausdehnung_wgs84:
    "POLYGON ((7.156626022224836 51.25471164844562, 7.156555995658681 51.254714865404175, 7.156488314742858 51.254726593261275, 7.156425580383388 51.25474638132785, 7.156370203402878 51.25477346916905, 7.156324311897558 51.254806815825944, 7.156289669457268 51.25484513981722, 7.156267607390928 51.25488696838394, 7.15625897356213 51.25493069408529, 7.156264099801536 51.254974636570395, 7.156282789149108 51.255017107152845, 7.15631432341732 51.2550564737061, 7.156357490785572 51.255091223386145, 7.156410632366189 51.255120020770654, 7.156471705953002 51.255141759180255, 7.156538364502953 51.25515560320951, 7.156608046334594 51.255161020832624, 7.1566780735767495 51.25515780385002, 7.156745755083302 51.255146075889925, 7.156808489858299 51.25512628765713, 7.156863867015872 51.25509919961176, 7.1569097584328345 51.255065852743854, 7.156944400532798 51.25502752856684, 7.156966462058657 51.25498569986792, 7.1569750952291 51.254941974108064, 7.156969968313694 51.25489803164701, 7.1569512783753915 51.25485556116755, 7.156919743691655 51.25481619478051, 7.15687657614634 51.25478144530462, 7.156823434654079 51.25475264813114, 7.1567623614075915 51.25473090990727, 7.156695703398122 51.254717066010215, 7.156626022224836 51.25471164844562))",
};

export const filteredData = {
  data: {
    arbeitsauftrag: [
      {
        angelegt_am: "2015-09-25",
        angelegt_von: "WendlingM",
        id: 879,
        nummer: "00005991",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 11089,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2015-09-25",
        angelegt_von: "WendlingM",
        id: 880,
        nummer: "00005992",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 11090,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2015-06-25",
        angelegt_von: "ViereckelF",
        id: 565,
        nummer: "00005645",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 8573,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 8574,
              veranlassungsnummer: null,
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 8575,
              veranlassungsnummer: null,
              protokollnummer: 3,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 8576,
              veranlassungsnummer: null,
              protokollnummer: 4,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2015-09-25",
        angelegt_von: "WendlingM",
        id: 881,
        nummer: "00005993",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 11091,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: "Staat",
              bemerkung: null,
              defekt: null,
              datum: "2015-11-27",
              arbeitsprotokollstatus: {
                bezeichnung: "Fehlmeldung",
                schluessel: "2",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 11092,
              veranlassungsnummer: null,
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: "Staat",
              bemerkung: "Test",
              defekt: null,
              datum: "2015-11-26",
              arbeitsprotokollstatus: {
                bezeichnung: "in Bearbeitung",
                schluessel: "0",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2016-02-29",
        angelegt_von: "ViereckelF",
        id: 1119,
        nummer: "00006251",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 14199,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14200,
              veranlassungsnummer: null,
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14201,
              veranlassungsnummer: null,
              protokollnummer: 3,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14202,
              veranlassungsnummer: null,
              protokollnummer: 4,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14203,
              veranlassungsnummer: null,
              protokollnummer: 5,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14204,
              veranlassungsnummer: null,
              protokollnummer: 6,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14205,
              veranlassungsnummer: null,
              protokollnummer: 7,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2016-03-16",
        angelegt_von: "ViereckelF",
        id: 1148,
        nummer: "00006282",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 14390,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14391,
              veranlassungsnummer: "00007081",
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14392,
              veranlassungsnummer: "00007082",
              protokollnummer: 3,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14393,
              veranlassungsnummer: "00007084",
              protokollnummer: 4,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14394,
              veranlassungsnummer: "00007084",
              protokollnummer: 5,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14395,
              veranlassungsnummer: "00007085",
              protokollnummer: 6,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 14396,
              veranlassungsnummer: "00007086",
              protokollnummer: 7,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2016-05-30",
        angelegt_von: "ViereckelF",
        id: 1234,
        nummer: "00006369",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 15616,
              veranlassungsnummer: "00007178",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15617,
              veranlassungsnummer: "00007178",
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15618,
              veranlassungsnummer: "00007178",
              protokollnummer: 3,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15619,
              veranlassungsnummer: "00007178",
              protokollnummer: 4,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15620,
              veranlassungsnummer: "00007178",
              protokollnummer: 5,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15621,
              veranlassungsnummer: "00007178",
              protokollnummer: 6,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15622,
              veranlassungsnummer: "00007178",
              protokollnummer: 7,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15623,
              veranlassungsnummer: "00007178",
              protokollnummer: 8,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15624,
              veranlassungsnummer: "00007178",
              protokollnummer: 9,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15625,
              veranlassungsnummer: "00007178",
              protokollnummer: 10,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15626,
              veranlassungsnummer: "00007180",
              protokollnummer: 11,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 15627,
              veranlassungsnummer: "00007181",
              protokollnummer: 12,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2016-09-29",
        angelegt_von: "ViereckelF",
        id: 1345,
        nummer: "00006480",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 17497,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 17498,
              veranlassungsnummer: "00007353",
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 17499,
              veranlassungsnummer: "00007355",
              protokollnummer: 3,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 17500,
              veranlassungsnummer: "00007356",
              protokollnummer: 4,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2017-03-22",
        angelegt_von: "ViereckelF",
        id: 1477,
        nummer: null,
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 21517,
              veranlassungsnummer: "00008070",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2017-11-22",
        angelegt_von: "WendlingM",
        id: 1767,
        nummer: "00006927",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 34110,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2018-01-08",
        angelegt_von: "MenarbinS",
        id: 1922,
        nummer: "00007085",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 34354,
              veranlassungsnummer: "00009565",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2018-04-10",
        angelegt_von: "MenarbinS",
        id: 2485,
        nummer: "00007655",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 38434,
              veranlassungsnummer: "00010172",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2019-01-16",
        angelegt_von: "WendlingM",
        id: 3657,
        nummer: "00008841",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 44030,
              veranlassungsnummer: "00011734",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2019-05-09",
        angelegt_von: "MenarbinS",
        id: 4190,
        nummer: "00009382",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 48884,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 48885,
              veranlassungsnummer: null,
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2019-05-09",
        angelegt_von: "MenarbinS",
        id: 4191,
        nummer: "00009385",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 48886,
              veranlassungsnummer: null,
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 48887,
              veranlassungsnummer: null,
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2019-11-14",
        angelegt_von: "MenarbinS",
        id: 4967,
        nummer: "00010165",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 54699,
              veranlassungsnummer: "00013401",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-07-27",
        angelegt_von: "ViereckelF",
        id: 6865,
        nummer: "00012081",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 75954,
              veranlassungsnummer: "00016155",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: "Eck",
              bemerkung: "Kabel abgeleg Kabelfehler",
              defekt: null,
              datum: "2021-08-10",
              arbeitsprotokollstatus: {
                bezeichnung: "in Bearbeitung",
                schluessel: "0",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-07-27",
        angelegt_von: "ViereckelF",
        id: 6875,
        nummer: "00012091",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 75964,
              veranlassungsnummer: "00016165",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: "Eck",
              bemerkung: "Baustelle Leitung abgeklemmt",
              defekt: null,
              datum: "2021-08-02",
              arbeitsprotokollstatus: {
                bezeichnung: "in Bearbeitung",
                schluessel: "0",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-09-13",
        angelegt_von: "MenarbinS",
        id: 7023,
        nummer: "00012239",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 77124,
              veranlassungsnummer: "00016329",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: "Coban/Schmitz",
              bemerkung: "Keine Netzspannung an L37, Einspeisung von L41 Provisorisch hergestellt",
              defekt: null,
              datum: "2021-09-14",
              arbeitsprotokollstatus: {
                bezeichnung: "in Bearbeitung",
                schluessel: "0",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-10-27",
        angelegt_von: "MenarbinS",
        id: 7196,
        nummer: "00012411",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 78339,
              veranlassungsnummer: "00016531",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: "Coban",
              bemerkung: null,
              defekt: null,
              datum: "2021-10-29",
              arbeitsprotokollstatus: {
                bezeichnung: "erledigt",
                schluessel: "1",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
          {
            arbeitsprotokoll: {
              id: 78379,
              veranlassungsnummer: null,
              protokollnummer: 2,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-12-08",
        angelegt_von: "ViereckelF",
        id: 7340,
        nummer: "00012556",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 78678,
              veranlassungsnummer: "00016714",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-12-10",
        angelegt_von: "ViereckelF",
        id: 7348,
        nummer: "00012564",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 78807,
              veranlassungsnummer: "00016726",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-12-10",
        angelegt_von: "ViereckelF",
        id: 7349,
        nummer: "00012565",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 78808,
              veranlassungsnummer: "00016727",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2021-12-28",
        angelegt_von: "ViereckelF",
        id: 7400,
        nummer: "00012617",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 78951,
              veranlassungsnummer: "00016866",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: "Coban/Kiesler",
              bemerkung: "Keine Spannung",
              defekt: null,
              datum: "2022-02-02",
              arbeitsprotokollstatus: {
                bezeichnung: "in Bearbeitung",
                schluessel: "0",
              },
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-02-01",
        angelegt_von: "SchegaM104",
        id: 7490,
        nummer: "00012709",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 79172,
              veranlassungsnummer: "00017014",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-03-10",
        angelegt_von: "ViereckelF",
        id: 7613,
        nummer: "00012835",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 82890,
              veranlassungsnummer: "00017208",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-03-22",
        angelegt_von: "ViereckelF",
        id: 7639,
        nummer: "00012861",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 82926,
              veranlassungsnummer: "00017236",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-03-22",
        angelegt_von: "ViereckelF",
        id: 7640,
        nummer: "00012862",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 82927,
              veranlassungsnummer: "00017237",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-03-24",
        angelegt_von: "ViereckelF",
        id: 7650,
        nummer: "00012872",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 82937,
              veranlassungsnummer: "00017247",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-03-24",
        angelegt_von: "ViereckelF",
        id: 7651,
        nummer: "00012873",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 82938,
              veranlassungsnummer: "00017248",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-14",
        angelegt_von: "WendlingM",
        id: 7716,
        nummer: "00012935",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83568,
              veranlassungsnummer: "00017317",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-26",
        angelegt_von: "MenarbinS",
        id: 7791,
        nummer: "00013013",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84855,
              veranlassungsnummer: "00017375",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-20",
        angelegt_von: "WendlingM",
        id: 7718,
        nummer: "00012937",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83614,
              veranlassungsnummer: "00017319",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-20",
        angelegt_von: "ViereckelF",
        id: 7719,
        nummer: "00012938",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83615,
              veranlassungsnummer: "00017320",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-20",
        angelegt_von: "ViereckelF",
        id: 7720,
        nummer: "00012939",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83616,
              veranlassungsnummer: "00017321",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-20",
        angelegt_von: "ViereckelF",
        id: 7721,
        nummer: "00012940",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83617,
              veranlassungsnummer: "00017322",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-20",
        angelegt_von: "ViereckelF",
        id: 7722,
        nummer: "00012941",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83618,
              veranlassungsnummer: "00017323",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-20",
        angelegt_von: "ViereckelF",
        id: 7732,
        nummer: "00012951",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 83628,
              veranlassungsnummer: "00017333",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-26",
        angelegt_von: "ViereckelF",
        id: 7793,
        nummer: "00013015",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84939,
              veranlassungsnummer: "00017377",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-21",
        angelegt_von: "ViereckelF",
        id: 7762,
        nummer: "00012984",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84825,
              veranlassungsnummer: "00017346",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-21",
        angelegt_von: "ViereckelF",
        id: 7763,
        nummer: "00012985",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84826,
              veranlassungsnummer: "00017347",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-26",
        angelegt_von: "ViereckelF",
        id: 7794,
        nummer: "00013016",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84940,
              veranlassungsnummer: "00017378",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-22",
        angelegt_von: "ViereckelF",
        id: 7779,
        nummer: "00013001",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84842,
              veranlassungsnummer: "00017363",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-22",
        angelegt_von: "ViereckelF",
        id: 7783,
        nummer: "00013005",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84846,
              veranlassungsnummer: "00017367",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-25",
        angelegt_von: "MenarbinS",
        id: 7790,
        nummer: "00013012",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84854,
              veranlassungsnummer: "00017374",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
      {
        angelegt_am: "2022-04-27",
        angelegt_von: "ViereckelF",
        id: 7797,
        nummer: "00013019",
        zugewiesen_an: 27,
        team: {
          id: 27,
        },
        ar_protokolleArray: [
          {
            arbeitsprotokoll: {
              id: 84943,
              veranlassungsnummer: "00017381",
              protokollnummer: 1,
              is_deleted: null,
              material: null,
              monteur: null,
              bemerkung: null,
              defekt: null,
              datum: null,
              arbeitsprotokollstatus: null,
              tdta_standort_mast: null,
              schaltstelle: null,
              mauerlasche: null,
              leitung: null,
              abzweigdose: null,
            },
          },
        ],
      },
    ],
  },
};
