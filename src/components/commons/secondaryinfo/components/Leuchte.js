import React, { useState } from "react";
// import { version as reactCismapVersion } from "react-cismap/meta";

import SecondaryInfoPanelSection from "react-cismap/topicmaps/SecondaryInfoPanelSection";
import { getVCard } from "../../../../core/helper/featureHelper";

// import { getApplicationVersion } from "../version";

import { Descriptions, Image } from "antd";
import { convertToProperUpperLowerCase, getDate, getStrasse } from "../helper";
import { getWebDavUrl } from "../../../../constants/belis";

const OptionalDiv = ({ children }) => {
  if (children) {
    return <div>{children}</div>;
  }
};

const getLayout4Leuchte = ({ feature, jwt }) => {
  const hit = feature;
  const item = feature.properties;

  const subSections = [];
  const vcard = getVCard(feature);
  const title = vcard.infobox.header;
  const mainSection = (
    <div>
      <img
        alt='Bild'
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          float: "right",
          paddingBottom: "5px",
          maxHeight: "250px",
          maxWidth: "250px",
        }}
        src={getWebDavUrl(jwt, item.docs[0])}
        // width='250'
        // maxHeight='250'
      />

      <div>
        <h1>{vcard.infobox.title}</h1>
      </div>

      <div>
        <b>Standort:</b>
      </div>
      {getStrasse(item?.fk_strassenschluessel)}
      {item?.plz && (
        <div>
          {item?.plz} Wuppertal{" "}
          {item?.fk_standort?.stadtbezirk &&
            " (" + convertToProperUpperLowerCase(item?.fk_standort?.stadtbezirk?.bezirk) + ")"}
        </div>
      )}
      <OptionalDiv>{item?.fk_standort?.standortangabe}</OptionalDiv>

      <br />
      {item?.bemerkungen && (
        <>
          <div>
            <b>Bemerkung:</b>
          </div>
          <div>{item?.bemerkungen}</div>
          <br />
        </>
      )}
    </div>
  );

  //   const events = [
  //     ["Einbau", item?.einbaudatum],
  //     ["Wartungszyklus", item?.wartungszyklus],
  //     ["Nächster Wechsel", item?.naechster_wechsel],
  //     [,],
  //     [,],
  //     [,],
  //     [,],
  //     [,],
  //     [,],
  //     [,],
  //   ];

  subSections.push(
    <SecondaryInfoPanelSection key={"leuchte" + hit.id} bsStyle='success' header={"Leuchte"}>
      <Descriptions column={{ xs: 1, sm: 1, md: 3, lg: 3, xxl: 3 }} layout='horizontal' bordered>
        <Descriptions.Item label='Inbetriebnahme' span={3}>
          {getDate(item?.inbetriebnahme_leuchte)}
        </Descriptions.Item>
        {/* Strasse, Hausnummer, Standortangabe */}

        {/* Energielieferant */}
        <Descriptions.Item label='Energielieferant'>
          {item?.fk_energielieferant?.energielieferant}
        </Descriptions.Item>

        {/* Schaltstelle */}
        <Descriptions.Item label='Schaltstelle'>{item?.schaltstelle}</Descriptions.Item>

        {/* Rundsteuerempfänger */}
        <Descriptions.Item label='Rundsteuerempfänger'>
          {item?.rundsteuerempfaenger?.rs_typ}
        </Descriptions.Item>

        {/* Unterhalt */}
        <Descriptions.Item label='Unterhalt'>
          {item?.fk_unterhaltspflicht_leuchte?.unterhaltspflichtiger_leuchte}
        </Descriptions.Item>

        {/* Zähler */}
        <Descriptions.Item label='Zähler'>
          {item?.zaehler ? "Zähler vorhanden" : "kein Zähler vorhanden"}
        </Descriptions.Item>

        {/* Leuchtmittel */}

        {/* Montagefirma */}
        <Descriptions.Item label='Montagefirma' divider>
          {item?.montagefirma_leuchte}
        </Descriptions.Item>
      </Descriptions>
    </SecondaryInfoPanelSection>
  );

  subSections.push(
    <SecondaryInfoPanelSection key={"dk" + hit.id} bsStyle='warning' header={"Doppelkommandos"}>
      {/* Doppelkommandos */}
      <Descriptions column={{ xs: 1, sm: 1, md: 3, lg: 3, xxl: 3 }} layout='horizontal' bordered>
        {item?.fk_dk1 && (
          <>
            <Descriptions.Item label='Doppelkommando 1'>
              {item?.fk_dk1?.beschreibung}
            </Descriptions.Item>
            <Descriptions.Item label='Anzahl Doppelkommando 1'>
              {item?.anzahl_1dk}
            </Descriptions.Item>
            <Descriptions.Item label='Anschlussleistung DK 1'>
              {item?.anschlussleistung_1dk} kW
            </Descriptions.Item>
          </>
        )}
        {item?.fk_dk2 && (
          <>
            <Descriptions.Item label='Doppelkommando 2'>
              {item?.fk_dk2?.beschreibung}
            </Descriptions.Item>
            <Descriptions.Item label='Anzahl Doppelkommando 2'>
              {item?.fk_dk2?.beschreibung}
            </Descriptions.Item>
            <Descriptions.Item label='Anschlussleistung DK 2'>
              {item?.anschlussleistung_2dk} kW
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
    </SecondaryInfoPanelSection>
  );
  subSections.push(
    <SecondaryInfoPanelSection key={"Leuchtmittel" + hit.id} bsStyle='info' header={"Leuchtmittel"}>
      <Descriptions column={{ xs: 1, sm: 1, md: 3, lg: 3, xxl: 3 }} layout='horizontal' bordered>
        <>
          <Descriptions.Item label='Lebensdauer'>{item?.lebensdauer}</Descriptions.Item>
          <Descriptions.Item label='letzter Leuchtmittelwechsel'>
            {getDate(item?.wechseldatum)}
          </Descriptions.Item>
          <Descriptions.Item label='nächster Leuchtmittelwechsel'>
            {getDate(item?.naechster_wechsel)}
          </Descriptions.Item>

          <Descriptions.Item label='Sonderturnus'>
            {getDate(item?.wartungszyklus)}
          </Descriptions.Item>
        </>
      </Descriptions>
    </SecondaryInfoPanelSection>
  );
  subSections.push(
    <SecondaryInfoPanelSection key={"mast" + hit.id} bsStyle='warning' header={"Mast"}>
      <Descriptions layout='horizontal' bordered>
        <Descriptions.Item label='Mastart'>
          {item?.fk_standort?.mastart !== undefined
            ? item?.fk_standort?.mastart.mastart
            : "Mast ohne Mastart"}
        </Descriptions.Item>

        <Descriptions.Item label='Masttyp'>{item?.fk_standort?.masttyp?.masttyp}</Descriptions.Item>
      </Descriptions>
    </SecondaryInfoPanelSection>
  );

  return { title, mainSection, subSections };
};

export default getLayout4Leuchte;
