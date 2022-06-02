import { getVCard } from "../../../../core/helper/featureHelper";

const getLayout4Protokoll = ({ feature, jwt, dispatch, setIndex, setVisible }) => {
  const vcard = getVCard(feature);
  const title = vcard.infobox.header;
  let mainSectionStyle = {};
  const subSections = [];

  const mainSection = <div style={mainSectionStyle}></div>;
  return { title, mainSection, subSections };
};

export default getLayout4Protokoll;
