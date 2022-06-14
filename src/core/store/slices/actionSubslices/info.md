## AddINcident https://belis-cloud-api.cismet.de:443/actions/BELIS2.AddIncident/

### Nur Veranlassung

```
{
  parameters: {
    BEZEICHNUNG: "StÃ¶rung (nur Veranlassung)",
    BESCHREIBUNG: "Beschreibung ",
    BEMERKUNG: "Bemerkungen ",
    OBJEKT_ID: "25432",
    AKTION: "VERANLASSUNG",
    OBJEKT_TYP: "TDTA_LEUCHTEN",
  },
}
```

### Einzelauftrag

```
{
  parameters: {
    BESCHREIBUNG: "Beschreibung x",
    OBJEKT_ID: "25432",
    BEZEICHNUNG: "StÃ¶rung (Einzelauftrag)",
    BEMERKUNG: "Bemerkungen x",
    OBJEKT_TYP: "TDTA_LEUCHTEN",
    AKTION: "EINZELAUFTRAG",
    ARBEITSAUFTRAG_ZUGEWIESEN_AN: "79",
  },
}
```

### Arbeitsauftrag zuordnen

```
{
  parameters: {
    BESCHREIBUNG: "Beschreibung x",
    ARBEITSAUFTRAG: "7852",
    OBJEKT_ID: "25432",
    BEZEICHNUNG: "StÃ¶rung  (AA)",
    BEMERKUNG: "Bemerkungen x",
    OBJEKT_TYP: "TDTA_LEUCHTEN",
    AKTION: "ADD2ARBEITSAUFTRAG",
  },
};
```

## ProtokollStatusAenderung https://belis-cloud-api.cismet.de:443/actions/BELIS2.ProtokollStatusAenderung/

```
{
  parameters: {
    DATUM: "1655159255157",
    STATUS: "1",
    BEMERKUNG: "Neue Testbemerkung",
    MATERIAL: "Neues Testmaterial",
    PROTOKOLL_ID: "85031",
    MONTEUR: "Cismet",
  },
};

```

### Freie Geometrie

#### BELIS2.ProtokollFortfuehrungsantrag (Sonstiges)

```
 {
  parameters: {
    DATUM: "1655110607108",
    BEMERKUNG:
      "Sonstiges Informationen zu den durchgefÃ¼hrten TÃ¤tigkeiten (Statusdatum auf 13. gesetzt)",
    STATUS: "1",
    PROTOKOLL_ID: "85031",
    MONTEUR: "Cismet",
  },
};

```

### Leuchten

#### BELIS2.ProtokollLeuchteLeuchtenerneuerung

```
{
  parameters: {
    INBETRIEBNAHMEDATUM: "1655198000943",
    MONTEUR: "Cismet",
    DATUM: "1655198000943",
    STATUS: "2",
    PROTOKOLL_ID: "85032",
    LEUCHTENTYP: "331",
  },
};

```

#### BELIS2.ProtokollLeuchteLeuchtmittelwechselElekpruefung

```
{
  parameters: {
    LEBENSDAUER: "1",
    ERDUNG_IN_ORDNUNG: "ja",
    PROTOKOLL_ID: "85032",
    PRUEFDATUM: "1655198179525",
    MONTEUR: "Cismet",
    WECHSELDATUM: "1655198179525",
    LEUCHTMITTEL: "25",
    DATUM: "1655198179526",
    STATUS: "2",
  },
};
```

#### BELIS2.ProtokollLeuchteLeuchtmittelwechsel

```
{
  parameters: {
    LEBENSDAUER: "1",
    PROTOKOLL_ID: "85032",
    MONTEUR: "Cismet",
    LEUCHTMITTEL: "25",
    WECHSELDATUM: "1655198421886",
    DATUM: "1655198421887",
    STATUS: "2",
  },
};


```

#### BELIS2.ProtokollLeuchteRundsteuerempfaengerwechsel

```
{
  parameters: {
    DATUM: "1655198490029",
    EINBAUDATUM: "1655198490029",
    RUNDSTEUEREMPFAENGER: "6735",
    STATUS: "2",
    PROTOKOLL_ID: "85032",
    MONTEUR: "Cismet",
  },
};

```

#### BELIS2.ProtokollLeuchteSonderturnus

```
{
  parameters: {
      DATUM: "1655198546066",
      STATUS: "2",
      PROTOKOLL_ID: "85032",
      MONTEUR: "Cismet" },
};
```

#### BELIS2.ProtokollLeuchteVorschaltgeraetwechsel

```
{
  parameters: {
    VORSCHALTGERAET: "Freitext",
    WECHSELDATUM: "1655198628112",
    DATUM: "1655198628112",
    STATUS: "2",
    PROTOKOLL_ID: "85032",
    MONTEUR: "Cismet",
  },
};

```

#### BELIS2.ProtokollFortfuehrungsantrag

```
 {
  parameters: {
    DATUM: "1655198692768",
    BEMERKUNG: "Leuchte: Informationen zu den durchgefÃ¼hrten TÃ¤tigkeiten ",
    STATUS: "2",
    PROTOKOLL_ID: "85032",
    MONTEUR: "Cismet",
  },
};

```

### Mast

#### BELIS2.ProtokollStandortAnstricharbeiten

```
{
  parameters: {
    MONTEUR: "Cismet",
    DATUM: "1655198845325",
    ANSTRICHFARBE: "Freitext",
    STATUS: "1",
    PROTOKOLL_ID: "85033",
    ANSTRICHDATUM: "1655198845325",
  },
};
```

#### BELIS2.ProtokollStandortElektrischePruefung

```
{
  parameters: {
    MONTEUR: "Cismet",
    ERDUNG_IN_ORDNUNG: "ja",
    DATUM: "1655198913293",
    STATUS: "1",
    PROTOKOLL_ID: "85033",
    PRUEFDATUM: "1655198913292",
  },
};
```

#### BELIS2.ProtokollStandortMasterneuerung

```
{
  parameters: {
    INBETRIEBNAHMEDATUM: "1655198968262",
    MONTEUR: "Cismet",
    DATUM: "1655198968262",
    STATUS: "1",
    PROTOKOLL_ID: "85033",
    MONTAGEFIRMA: "Freitext Firma",
  },
};
```

#### BELIS2.ProtokollStandortRevision

```
{
  parameters: {
    DATUM: "1655199026532",
    STATUS: "1",
    REVISIONSDATUM: "1655199026532",
    PROTOKOLL_ID: "85033",
    MONTEUR: "Cismet",
  },
};

```

#### BELIS2.ProtokollStandortStandsicherheitspruefung

```
 {
  parameters: {
    NAECHSTES_PRUEFDATUM: "1655199076123",
    PROTOKOLL_ID: "85033",
    MONTEUR: "Cismet",
    PRUEFDATUM: "1655199076123",
    VERFAHREN: "Freitext Verfahren",
    DATUM: "1655199076123",
    STATUS: "1",
  },
};

```

#### BELIS2.ProtokollFortfuehrungsantrag

```
wie oben
```

### Leitung

#### BELIS2.ProtokollFortfuehrungsantrag

```
wie oben
```

### Schaltstelle

#### BELIS2.ProtokollSchaltstelleRevision

```
{
  parameters: {
    PRUEFDATUM: "1655199671806",
    DATUM: "1655199671806",
    STATUS: "1",
    PROTOKOLL_ID: "85035",
    MONTEUR: "Cismet",
  },
};

```

#### BELIS2.ProtokollFortfuehrungsantrag

```
wie oben
```

### Abzweigdose

#### BELIS2.ProtokollFortfuehrungsantrag

```
wie oben
```

### Mauerlasche

#### BELIS2.ProtokollMauerlaschePruefung

```
{
  parameters: {
    PRUEFDATUM: "1655199819085",
    DATUM: "1655199819085",
    STATUS: "1",
    PROTOKOLL_ID: "85037",
    MONTEUR: "Cismet",
  },
};
```

#### BELIS2.ProtokollFortfuehrungsantrag

```
wie oben
```
