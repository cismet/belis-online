import { Descriptions } from "antd";
import { getVCard } from "../../../../core/helper/featureHelper";
import { geomFactories } from "../../../../core/queries/online";
import { createFeatureFromData } from "../../../../core/store/slices/featureCollectionSubslices/objects";
import SecondaryInfoPanelSection from "../SecondaryInfoPanelSection";
import { clearOptionalDescriptionItems, getDate, getTimelineForActions } from "./helper";
import getLayout4Leuchte from "./Leuchte";

const getLayout4Protokoll = ({ feature, jwt, dispatch, setIndex, setVisible }) => {
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
  if (item.tdta_leuchten) {
    fachobjektTyp = "Leuchte";
    console.log("geomFactories", geomFactories);

    const subFeature = createFeatureFromData(
      item.tdta_leuchten,
      "tdta_leuchten",
      (o) => o?.tdta_standort_mast?.geom
    );
    console.log("subFeature", subFeature);

    const { title, mainSection, subSections } = getLayout4Leuchte({
      feature: subFeature,
      jwt,
      dispatch,
      setIndex,
      setVisible,
    });
    fachobjektTitle = title;
    fachobjektContent = <div>mainSection</div>;
  } else if (item.leitung) {
    fachobjektTyp = "Leitung";
  } else if (item.schaltstelle) {
    fachobjektTyp = "Schaltstelle";
  } else if (item.geometrie) {
    fachobjektTyp = "Freie Geometrie";
  } else if (item.tdta_standort_mast) {
    fachobjektTyp = "Mast";
  } else if (item.leitung) {
    fachobjektTyp = "Leitung";
  } else if (item.abzweigdose) {
    fachobjektTyp = "Abzweigdose";
  } else if (item.mauerlasche) {
    fachobjektTyp = "Mauerlasche";
  }

  subSections.push(
    <SecondaryInfoPanelSection
      key={"fachobjekt.for." + item.id}
      bsStyle='danger'
      header={fachobjektTitle}
    >
      {fachobjektContent}
    </SecondaryInfoPanelSection>
  );
  return { title, mainSection, subSections };
};

export default getLayout4Protokoll;
