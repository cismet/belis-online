import { getVCard } from "../../../../core/helper/featureHelper";

const getLayout4Arbeitsauftrag = ({ feature, jwt, dispatch, setIndex, setVisible }) => {
  const vcard = getVCard(feature);
  const item = feature.properties;
  const title = vcard.infobox.header;

  let mainSectionStyle = {};
  const subSections = [];

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
        <h3 style={{ textAlign: "right" }}>zugewiesen an: {item.team.name}</h3>
        <h3>angelegt von: {item.angelegt_von}</h3>
        <h3 style={{ textAlign: "right" }}>
          angelegt am: {new Date(item.angelegt_am).toLocaleDateString()}
        </h3>
      </div>
      {/* <div>Kennziffer {item?.fk_kennziffer?.kennziffer}</div>
      <div>
        <b>Standort:</b>
      </div> */}
    </div>
  );
  return { title, mainSection, subSections };
};

export default getLayout4Arbeitsauftrag;
