import { Descriptions, Row, Col, Timeline } from "antd";
import { getWebDavUrl } from "../../../../constants/belis";
import { getVCard } from "../../../../core/helper/featureHelper";
import { setIndex, setVisible } from "../../../../core/store/slices/photoLightbox";
import { mastOhneLeuchte } from "../devData";
import {
  addDotThumbnail,
  clearOptionalDescriptionItems,
  getSquaredThumbnails,
  getStrasse,
  getTimelineForEvents,
} from "./helper";
import SecondaryInfoPanelSection from "react-cismap/topicmaps/SecondaryInfoPanelSection";

export const getEventsForStandort = (item) => {
  const events = [
    ["elektrische Prüfung", item?.elek_pruefung, "M"],
    ["Inbetriebnahme", item?.inbetriebnahme_mast, "M"],
    ["letzte Änderung", item?.letzte_aenderung, "M"],
    ["Mastanstrich", item?.mastanstrich, "M"],
    ["Mastschutz", item?.mastschutz, "M"],
    ["Nächste Prüfung", item?.naechstes_pruefdatum, "M"],
    ["Revision", item?.revision, "M"],
    ["Standsicherheitsprüfung", item?.standsicherheitspruefung, "M"],
  ];

  return events;
};

const getLayout4Standort = ({ feature, jwt, dispatch }) => {
  const item = feature.properties;
  // const item = mastOhneLeuchte;

  const subSections = [];
  const vcard = getVCard(feature);
  const title = vcard.infobox.header;

  const events = getEventsForStandort(item);

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
      {getStrasse(item?.fk_strassenschluessel, item?.haus_nr)}
      {item?.plz && (
        <div>
          {item?.plz} Wuppertal {item?.stadtbezirk && " (" + item?.stadtbezirk?.bezirk + ")"}
        </div>
      )}
      {item?.standortangabe && <div>{item?.standortangabe}</div>}
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
  subSections.push(
    <SecondaryInfoPanelSection
      key={"mast" + item?.fk_standort?.id}
      bsStyle='warning'
      header={"Mast"}
    >
      <Row>
        <Col span={12}>
          {getStandortDetails({
            standortItem: item,
            docs,
            jwt,
            dispatch,
            columns: { xs: 1, sm: 1, md: 1, lg: 1, xxl: 1 },
          })}
        </Col>
        <Col span={12}>{getTimelineForEvents({ events })}</Col>
      </Row>
    </SecondaryInfoPanelSection>
  );

  return { title, mainSection, subSections };
};

export const getStandortDetails = ({
  standortItem,
  docs,
  jwt,
  dispatch,
  columns = { xs: 1, sm: 1, md: 2, lg: 2, xxl: 3 },
}) => {
  const standortItems = [
    <Descriptions.Item optionalPredicate={() => true} label='Mastart'>
      {standortItem?.fk_mastart ? standortItem?.fk_mastart.mastart : "Mast ohne Mastart"}
    </Descriptions.Item>,
    <Descriptions.Item label='Anstrichfarbe'>{standortItem?.anstrichfarbe}</Descriptions.Item>,

    <Descriptions.Item label='Masttyp'>{standortItem?.fk_masttyp?.masttyp}</Descriptions.Item>,
    <Descriptions.Item label='Kennziffer'>
      {standortItem?.fk_kennziffer?.beschreibung} ({standortItem?.fk_kennziffer?.kennziffer})
    </Descriptions.Item>,

    <Descriptions.Item label='Klassifizierung'>
      {standortItem?.fk_klassifizierung?.klassifizierung}
    </Descriptions.Item>,
    <Descriptions.Item label='Anlagengruppe'>
      {standortItem?.anlagengruppeObject?.bezeichnung}
    </Descriptions.Item>,
    <Descriptions.Item label='Bermerkungen' span={24}>
      {standortItem?.bemerkungen}
    </Descriptions.Item>,
    <Descriptions.Item label='Anbauten'>{standortItem?.anbauten}</Descriptions.Item>,

    <Descriptions.Item label='Verfahren'>{standortItem?.verfahren}</Descriptions.Item>,
    <Descriptions.Item label='Monteur'>{standortItem?.monteur}</Descriptions.Item>,
    <Descriptions.Item label='Montagefirma'>{standortItem?.montagefirma}</Descriptions.Item>,
    <Descriptions.Item label='Gründung'>{standortItem?.gruendung}</Descriptions.Item>,
    <Descriptions.Item label='Erdung' optionalPredicate={() => true}>
      {standortItem?.erdung === true ? "vorhanden" : "nicht vorhanden"}
    </Descriptions.Item>,
    <Descriptions.Item label='Verrechnungseinheit'>
      {standortItem?.verrechnungseinheit === true ? "vorhanden" : "nicht vorhanden"}
    </Descriptions.Item>,
    <Descriptions.Item label='Unterhaltspflicht'>
      {standortItem?.unterhaltspflicht_mast?.unterhalt_mast}
    </Descriptions.Item>,
  ];
  return (
    <>
      <Descriptions column={columns} layout='horizontal' bordered>
        {clearOptionalDescriptionItems(standortItems)}
        {/* {standortItems} */}
      </Descriptions>
      {getSquaredThumbnails(docs, "Standort", jwt, dispatch)}
    </>
  );
};

export default getLayout4Standort;