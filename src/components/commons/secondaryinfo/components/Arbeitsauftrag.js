import { getVCard } from "../../../../core/helper/featureHelper";
import {
  getFeatureForProtokoll,
  getFeaturesForProtokollArray,
} from "../../../../core/store/slices/featureCollectionSubslices/protocols";
import getLayout4Protokoll from "./Protokoll";
import SecondaryInfoPanelSection from "../SecondaryInfoPanelSection";

const getLayout4Arbeitsauftrag = ({
  feature,
  jwt,
  dispatch,
  setIndex,
  setVisible,
  showActions = true,
}) => {
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
  const pfs = getFeaturesForProtokollArray(item?.ar_protokolleArray);
  for (const pf of pfs || []) {
    const vcard = getVCard(pf);
    const prot = pf.properties;
    const layoutResult = getLayout4Protokoll({
      feature: pf,
      jwt,
      dispatch,
      setIndex,
      setVisible,
      showActions: false,
    });

    let style = "default";
    if (prot?.arbeitsprotokollstatus?.schluessel === "0") {
      //in Bearbeitung
      style = "warning";
    } else if (prot?.arbeitsprotokollstatus?.schluessel === "1") {
      //erledigt
      style = "success";
    } else if (prot?.arbeitsprotokollstatus?.schluessel === "2") {
      // Fehlmeldung
      style = "danger";
    }
    console.log("item", item);

    subSections.push(
      <SecondaryInfoPanelSection
        key={"prot.in.aa.for." + pf.id}
        bsStyle={style}
        header={
          <div>
            <span>{vcard.list.main + " (" + vcard.list.subtitle + ")"}</span>
            <span style={{ float: "right" }}>
              {pf?.properties?.arbeitsprotokollstatus?.bezeichnung || "kein Status"}
            </span>
          </div>
        }
        collapsedOnStart={true}
      >
        <div>{layoutResult.subSections}</div>
      </SecondaryInfoPanelSection>
    );
  }

  return { title, mainSection, subSections };
};

export default getLayout4Arbeitsauftrag;
