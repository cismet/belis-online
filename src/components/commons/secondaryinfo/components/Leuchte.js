import React, { useState } from "react";
// import { version as reactCismapVersion } from "react-cismap/meta";

import SecondaryInfoPanelSection from "react-cismap/topicmaps/SecondaryInfoPanelSection";
import { getVCard } from "../../../../core/helper/featureHelper";

// import { getApplicationVersion } from "../version";
import Button from "react-bootstrap/Button";

import { Row, Col, Timeline } from "antd";
import { Descriptions } from "antd";
import {
  addDotThumbnail,
  clearOptionalDescriptionItems,
  convertToProperUpperLowerCase,
  getDate,
  getSquaredThumbnails,
  getStrasse,
  getTimelineForEvents,
} from "./helper";
import { getWebDavUrl } from "../../../../constants/belis";
import { getEventsForStandort, getStandortDetails } from "./Standort";

import { setIndex, setVisible } from "../../../../core/store/slices/photoLightbox";
import { leuchteMitAllenAttributen } from "../devData";

export const getEvents4Leuchte = (item) => {
  const events = [
    ["Einbau", item?.einbaudatum, "L"],
    ["Wartungszyklus", item?.wartungszyklus, "L"],
    ["Nächster Wechsel", item?.naechster_wechsel, "L"],
    ["Wechsel Vorschaltgerät", item?.wechselvorschaltgeraet, "L"],
    ["Wechsel", item?.wechseldatum, "L"],
    ["Inbetriebnahme", item?.inbetriebnahme_leuchte, "L"],
    ...getEventsForStandort(item?.fk_standort),
  ];
  return events;
};
const getLayout4Leuchte = ({ feature, jwt, dispatch }) => {
  const item = feature.properties;
  // const item = leuchteMitAllenAttributen;
  const subSections = [];
  const vcard = getVCard(feature);
  const title = vcard.infobox.header;

  const events = getEvents4Leuchte(item);

  let mainDoc;
  let docs = [];
  let mainSectionStyle = {};
  if (item?.docs && item?.docs[0]) {
    mainDoc = item?.docs[0];
    mainSectionStyle = { minHeight: "250px" };
  }
  docs = item?.docs; //;.splice(1);

  const mainSection = (
    <div style={mainSectionStyle}>
      {mainDoc && (
        <img
          onClick={() => {
            dispatch(setVisible(true));
            dispatch(setIndex(0));
          }}
          alt='Bild'
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            float: "right",
            paddingBottom: "5px",
            maxHeight: "250px",
            maxWidth: "250px",
          }}
          src={addDotThumbnail(getWebDavUrl(jwt, mainDoc))}
          // width='250'
          // maxHeight='250'
        />
      )}
      <div>
        <h1>{vcard.infobox.title}</h1>
      </div>
      <div>Kennziffer {item?.fk_kennziffer?.kennziffer}</div>
      <div>
        <b>Standort:</b>
      </div>
      {getStrasse(item?.fk_strassenschluessel, item?.fk_standort?.haus_nr)}
      {item?.plz && (
        <div>
          {item?.plz} Wuppertal{" "}
          {item?.fk_standort?.stadtbezirk && " (" + item?.fk_standort?.stadtbezirk?.bezirk + ")"}
        </div>
      )}
      {item?.fk_standort?.standortangabe && <div>{item?.fk_standort?.standortangabe}</div>}
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

  const rsItems = getRSDetailItems(item?.rundsteuerempfaenger);

  const leuchteItems = [
    <Descriptions.Item label='Energielieferant'>
      {item?.fk_energielieferant?.energielieferant}
    </Descriptions.Item>,
    <Descriptions.Item label='Schaltstelle'>{item?.schaltstelle}</Descriptions.Item>,
    ...(rsItems.length === 1 ? rsItems : []),
    <Descriptions.Item label='Unterhalt'>
      {item?.fk_unterhaltspflicht_leuchte?.unterhaltspflichtiger_leuchte}
    </Descriptions.Item>,
    <Descriptions.Item label='Montagefirma'>{item?.montagefirma_leuchte}</Descriptions.Item>,
    <Descriptions.Item label='Vorschaltgerät'>{item?.vorschaltgeraet}</Descriptions.Item>,
    <Descriptions.Item label='Monteur'>{item?.monteur}</Descriptions.Item>,
    <Descriptions.Item label='Zähler'>
      {item?.zaehler ? "Zähler vorhanden" : "kein Zähler vorhanden"}
    </Descriptions.Item>,
    <Descriptions.Item label='Lebensdauer'>{item?.lebensdauer}</Descriptions.Item>,
  ];

  subSections.push(
    <SecondaryInfoPanelSection
      key={"leuchte" + item?.id}
      bsStyle='success'
      header={"Leuchte und Gesamtverlauf"}
    >
      <Row>
        <Col span={12}>
          <Descriptions
            column={{ xs: 1, sm: 1, md: 1, lg: 1, xxl: 1 }}
            layout='horizontal'
            bordered
          >
            {clearOptionalDescriptionItems(leuchteItems)}
          </Descriptions>

          {getSquaredThumbnails(docs, "Leuchte", jwt, dispatch)}
        </Col>
        <Col span={12}>{getTimelineForEvents({ events })}</Col>
      </Row>
    </SecondaryInfoPanelSection>
  );
  if (rsItems.length > 1) {
    subSections.push(getRSDetailsSection(item?.rundsteuerempfaenger));
  }

  subSections.push(
    <SecondaryInfoPanelSection key={"dk" + item.id} bsStyle='warning' header={"Doppelkommandos"}>
      {/* Doppelkommandos */}
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 3 }} layout='horizontal' bordered>
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
            <br />
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

  const leuchtTypItem = item?.fk_leuchttyp;

  const leuchtTypItems = [
    <Descriptions.Item label='Bestückung'>{leuchtTypItem?.bestueckung}</Descriptions.Item>,
    <Descriptions.Item label='Typ'>{leuchtTypItem?.bestueckung}</Descriptions.Item>,
    <Descriptions.Item
      label='Leistung Brutto'
      optionalPredicate={() => leuchtTypItem?.leistung_brutto}
    >
      {leuchtTypItem?.leistung_brutto} kW
    </Descriptions.Item>,
    <Descriptions.Item label='Leistung' optionalPredicate={() => leuchtTypItem?.leistung}>
      {leuchtTypItem?.leistung} kW
    </Descriptions.Item>,
    <Descriptions.Item label='Lampe'>{leuchtTypItem?.lampe}</Descriptions.Item>,
    <Descriptions.Item label='Fabrikat'>{leuchtTypItem?.fabrikat}</Descriptions.Item>,
  ];

  subSections.push(
    <SecondaryInfoPanelSection
      key={"Leuchtmittel" + item.id}
      bsStyle='info'
      header={"Leuchtentyp (" + leuchtTypItem?.typenbezeichnung + ")"}
    >
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 3 }} layout='horizontal' bordered>
        {clearOptionalDescriptionItems(leuchtTypItems)}
        {/* {leuchtTypItems} */}
      </Descriptions>
      {getSquaredThumbnails(docs, "Leuchtentyp", jwt, dispatch)}
    </SecondaryInfoPanelSection>
  );

  subSections.push(
    <SecondaryInfoPanelSection
      key={"mast" + item?.fk_standort?.id}
      bsStyle='warning'
      header={"Mast"}
    >
      {getStandortDetails({ standortItem: item?.fk_standort, docs, jwt, dispatch })}
    </SecondaryInfoPanelSection>
  );

  return { title, mainSection, subSections };
};

export default getLayout4Leuchte;

export const getRSDetailItems = (rsItem) => {
  if (rsItem) {
    const rsItems = [
      <Descriptions.Item label='Rundsteuerempfänger Typ'>{rsItem?.rs_typ}</Descriptions.Item>,
      <Descriptions.Item label='Rundsteuerempfänger Anschlusswert'>
        {rsItem?.anschlusswert}
      </Descriptions.Item>,
      <Descriptions.Item label='Hersteller Rundsteuerempfänger'>
        {rsItem?.herrsteller_rs}
      </Descriptions.Item>,
      <Descriptions.Item label='RS Programm'>{rsItem?.programm}</Descriptions.Item>,
    ];
    return clearOptionalDescriptionItems(rsItems);
  } else {
    return [];
  }
};

export const getRSDetailsSection = (rsItem) => {
  if (rsItem) {
    return (
      <SecondaryInfoPanelSection
        key={"rs" + rsItem.id}
        bsStyle='warning'
        header={"Rundsteuerempfänger"}
      >
        <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 3 }} layout='horizontal' bordered>
          {clearOptionalDescriptionItems(getRSDetailItems(rsItem))}
        </Descriptions>
      </SecondaryInfoPanelSection>
    );
  } else {
    return null;
  }
};
