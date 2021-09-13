import { useContext } from "react";
import { UIDispatchContext } from "react-cismap/contexts/UIContextProvider";
import { version as reactCismapVersion } from "react-cismap/meta";
import { scroller } from "react-scroll";
import { getBelisVersion } from "../../../constants/versions";

const Footer = () => {
  const { setAppMenuActiveMenuSection } = useContext(UIDispatchContext);
  /*eslint jsx-a11y/anchor-is-valid: "off"*/
  return (
    <div style={{ fontSize: "11px" }}>
      <b>Hintergrundkarten</b>: Stadtkarte 2.0 © RVR | True Orthophoto 2020 © Stadt Wuppertal |
      Openmaptiles basierte Vectorkarte (hosted by cismet){" "}
      <a
        className='pleaseRenderAsLink'
        onClick={() => {
          // setAppMenuActiveMenuSection("help");
          // scroller.scrollTo("Datengrundlage", { containerId: "myMenu" });
        }}
      >
        (Details und Nutzungsbedingungen)
      </a>
      <br />
      <div>
        <b>
          {document.title} v{getBelisVersion()}
        </b>
        :{" "}
        <a href='https://cismet.de/' target='_cismet'>
          cismet GmbH
        </a>{" "}
        auf Basis von{" "}
        <a href='http://leafletjs.com/' target='_more'>
          Leaflet
        </a>{" "}
        und{" "}
        <a href='https://cismet.de/#refs' target='_cismet'>
          cids | react-cismap v{reactCismapVersion}
        </a>{" "}
        |{" "}
        <a
          target='_blank'
          rel='noopener noreferrer'
          href='https://cismet.de/datenschutzerklaerung.html'
        >
          Datenschutzerklärung (Privacy Policy)
        </a>
      </div>
    </div>
  );
};
export default Footer;
