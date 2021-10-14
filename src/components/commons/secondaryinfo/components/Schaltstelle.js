import { Descriptions } from "antd";
import { getWebDavUrl } from "../../../../constants/belis";
import { getVCard } from "../../../../core/helper/featureHelper";
import { setIndex, setVisible } from "../../../../core/store/slices/photoLightbox";
import {
  addDotThumbnail,
  clearOptionalDescriptionItems,
  getStrasse,
  getTimelineForEvents,
} from "./helper";
import { getRSDetailItems, getRSDetailsSection } from "./Leuchte";
import SecondaryInfoPanelSection from "react-cismap/topicmaps/SecondaryInfoPanelSection";

export const getEventsForSchaltstelle = (item) => {
  const events = [
    ["Erstellung", item?.erstellungsjahr, "M"],
    ["Prüfdatum", item?.pruefdatum, "M"],
    ["Einbau Rundsteuerempfänger", item?.einbaudatum_rs, "M"],
  ];

  return events;
};
const getLayout4Schaltstelle = ({ feature, jwt, dispatch }) => {
  const item = feature.properties;
  const subSections = [];
  const vcard = getVCard(feature);
  const title = vcard.infobox.header;

  const events = getEventsForSchaltstelle(item);
  console.log("events", events);

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
      <div>
        <b>Standort:</b>
      </div>
      {getStrasse(item?.fk_strassenschluessel, item?.haus_nr)}
      {item?.plz && (
        <div>
          {item?.plz} Wuppertal {item?.stadtbezirk && " (" + item?.stadtbezirk?.bezirk + ")"}
        </div>
      )}
      {item?.zusaetzliche_standortbezeichnung && (
        <div>{item?.zusaetzliche_standortbezeichnung}</div>
      )}
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
      <div>{getTimelineForEvents({ events })}</div>
    </div>
  );

  subSections.push(getRSDetailsSection(item?.rundsteuerempfaenger));
  return { title, mainSection, subSections };
};

export default getLayout4Schaltstelle;
