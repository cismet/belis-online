import { Descriptions } from "antd";
import { useContext } from "react";
import { LightBoxContext } from "react-cismap/contexts/LightBoxContextProvider";
import { getVCard } from "../../../../core/helper/featureHelper";
import { geomFactories } from "../../../../core/queries/online";
import { createFeatureFromData } from "../../../../core/store/slices/featureCollectionSubslices/objects";
import SecondaryInfoPanelSection from "../SecondaryInfoPanelSection";
import getLayout4Abzweigdose from "./Abzweigdose4Prot";
import getLayout4FreieGeometrie from "./FreieGeometrie4Prot";
import { clearOptionalDescriptionItems, getDate, getTimelineForActions } from "./helper";
import getLayout4Leitung from "./Leitung";
import getLayout4Leuchte from "./Leuchte";
import getLayout4Mauerlasche from "./Mauerlasche";
import getLayout4Schaltstelle from "./Schaltstelle";
import getLayout4Standort from "./Standort";

const getLayout4Protokoll = ({
  feature,
  jwt,
  dispatch,
  setIndex,
  setVisible,
  showAddPhotoAction = true,
}) => {
  const vcard = getVCard(feature);
  const item = feature.properties;

  const title = vcard.infobox.header;

  let mainSectionStyle = {};
  const subSections = [];

  const statusItems = [
    <Descriptions.Item label='Monteur'>{item?.monteur}</Descriptions.Item>,
    <Descriptions.Item label='Datum'>{getDate(item?.datum)}</Descriptions.Item>,
    <Descriptions.Item label='Bemerkung' span={3}>
      {item?.bemerkung}
    </Descriptions.Item>,
    <Descriptions.Item label='Material' span={3}>
      {item?.material}
    </Descriptions.Item>,
  ];

  const mainSection = (
    <div style={mainSectionStyle}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          padding: 20,
        }}
      >
        <h3>{vcard.infobox.title}</h3>
        <h3 style={{ textAlign: "right" }}>
          <span style={{ color: "grey" }}>
            {item?.arbeitsprotokollstatus?.bezeichnung || "kein Status"}
          </span>{" "}
          {vcard.list.upperright}
        </h3>
      </div>
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 2 }} layout='horizontal' bordered>
        {clearOptionalDescriptionItems(statusItems)}
      </Descriptions>
    </div>
  );
  if (item?.arbeitsprotokollaktionArray?.length > 0) {
    subSections.push(
      <SecondaryInfoPanelSection
        key={"Aktionen.for." + item.id}
        bsStyle='warning'
        header={"Aktionen"}
      >
        {getTimelineForActions({ actions: item?.arbeitsprotokollaktionArray })}
      </SecondaryInfoPanelSection>
    );
  }

  const veranlassungsItems = [
    <Descriptions.Item label='Nummer'>{item?.veranlassungsnummer}</Descriptions.Item>,

    <Descriptions.Item label='Grund (Art)'>
      {item?.veranlassung?.veranlassungsart?.bezeichnung}
    </Descriptions.Item>,
    <Descriptions.Item label='Bezeichnung' span={24}>
      {item?.veranlassung?.bezeichung}
    </Descriptions.Item>,
    <Descriptions.Item label='Beschreibung' span={3}>
      {item?.veranlassung?.beschreibung}
    </Descriptions.Item>,
    <Descriptions.Item label='angelegt von'>{item?.veranlassung?.username}</Descriptions.Item>,
    <Descriptions.Item label='angelegt am'>{getDate(item?.veranlassung?.datum)}</Descriptions.Item>,
    <Descriptions.Item label='Bemerkungen'>{item?.veranlassung?.bemerkungen}</Descriptions.Item>,
  ];

  subSections.push(
    <SecondaryInfoPanelSection
      key={"Veranlassung.for." + item.id}
      bsStyle='info'
      header={"Veranlassung " + item?.veranlassungsnummer}
    >
      <Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xxl: 2 }} layout='horizontal' bordered>
        {/* {clearOptionalDescriptionItems(veranlassungsItems)} */}
        {veranlassungsItems}
      </Descriptions>
    </SecondaryInfoPanelSection>
  );

  let fachobjektTyp;
  let fachobjektTitle;
  let fachobjektContent;

  let layouter;
  let subFeature;
  let fachobjekt;
  let fachobjektFeaturetype;
  if (item.tdta_leuchten) {
    fachobjektTyp = "Leuchte";
    fachobjekt = item.tdta_leuchten;
    fachobjektFeaturetype = "tdta_leuchten";
    layouter = getLayout4Leuchte;
  } else if (item.leitung) {
    fachobjektTyp = "Leitung";
    fachobjekt = item.leitung;
    fachobjektFeaturetype = "leitung";
    layouter = getLayout4Leitung;
  } else if (item.schaltstelle) {
    fachobjektTyp = "Schaltstelle";
    fachobjekt = item.schaltstelle;
    fachobjektFeaturetype = "schaltstelle";
    layouter = getLayout4Schaltstelle;
  } else if (item.geometrie) {
    fachobjektTyp = "Freie Geometrie";
    fachobjekt = item.geometrie;
    fachobjektFeaturetype = "geometrie";
    layouter = getLayout4FreieGeometrie;
  } else if (item.tdta_standort_mast) {
    fachobjektTyp = "Mast";
    fachobjekt = item.tdta_standort_mast;
    fachobjektFeaturetype = "tdta_standort_mast";
    layouter = getLayout4Standort;
  } else if (item.abzweigdose) {
    fachobjektTyp = "Abzweigdose";
    fachobjekt = item.abzweigdose;
    fachobjektFeaturetype = "abzweigdose";
    layouter = getLayout4Abzweigdose;
  } else if (item.mauerlasche) {
    fachobjektTyp = "Mauerlasche";
    fachobjekt = item.mauerlasche;
    fachobjektFeaturetype = "mauerlasche";
    layouter = getLayout4Mauerlasche;
  }
  subFeature = createFeatureFromData(fachobjekt, fachobjektFeaturetype);

  if (layouter) {
    const layoutResult = layouter({
      feature: subFeature,
      jwt,
      dispatch,
      setIndex,
      setVisible,
      showAddPhotoAction: false,
    });

    fachobjektTitle = layoutResult.title;
    fachobjektContent = (
      <div>
        {layoutResult.mainSection} {layoutResult.subSections}
      </div>
    );
  }
  subSections.push(
    <SecondaryInfoPanelSection
      key={"fachobjekt.for." + item.id}
      bsStyle='danger'
      header={fachobjektTyp + ": " + fachobjektTitle}
      collapsedOnStart={true}
    >
      {fachobjektContent}
    </SecondaryInfoPanelSection>
  );
  return { title, mainSection, subSections };
};

export default getLayout4Protokoll;
