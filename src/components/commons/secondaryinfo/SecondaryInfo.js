import React, { useState } from "react";
import { version as reactCismapVersion } from "react-cismap/meta";
import SecondaryInfo from "./Secondary";
import SecondaryInfoPanelSection from "react-cismap/topicmaps/SecondaryInfoPanelSection";
import {
  getFeatureCollection,
  getSelectedFeature,
  setSecondaryInfoVisible,
} from "../../../core/store/slices/featureCollection";
import { useDispatch, useSelector } from "react-redux";
import { getVCard } from "../../../core/helper/featureHelper";
import { getSecondaryInfo } from "../../../core/helper/secondaryInfoHelper";
// import { getApplicationVersion } from "../version";

import { Descriptions } from "antd";
import { getDate, getDoppelkommandos } from "./components/helper";
import { leuchteMitAllenAttributen } from "./devData";

import getLayout4Leuchte from "./components/Leuchte";
import { getJWT } from "../../../core/store/slices/auth";
import getLayout4Standort from "./components/Standort";
import getLayout4Schaltstelle from "./components/Schaltstelle";
import getLayout4Mauerlasche from "./components/Mauerlasche";

const InfoPanel = () => {
  const dispatch = useDispatch();
  const selectedFeature = useSelector(getSelectedFeature);
  // const selectedFeature = leuchteMitAllenAttributen;
  return <InfoPanelComponent selectedFeature={selectedFeature} dispatch={dispatch} />;
};

export const InfoPanelComponent = ({ selectedFeature, dispatch }) => {
  const hit = JSON.parse(JSON.stringify(selectedFeature));
  const jwt = useSelector(getJWT);
  const [showRawData, setShowRawData] = useState(false);

  const footer = (
    <div style={{ fontSize: "11px" }}>
      <div
        onClick={(e) => {
          if (e.detail === 2) {
            setShowRawData((old) => !old);
          }
        }}
      >
        <b>{/* {document.title} v{getApplicationVersion()} */}</b>:{" "}
        <a href='https://cismet.de/' target='_cismet'>
          cismet GmbH
        </a>{" "}
        auf Basis von{" "}
        <a href='http://leafletjs.com/' target='_more'>
          Leaflet
        </a>{" "}
        und{" "}
        <a href='https://cismet.de/#refs' target='_cismet'>
          {/* cids | react-cismap v{reactCismapVersion} */}
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
  //remove geometry and feature reference
  try {
    delete hit.geometry;
    delete hit.properties.feature;
  } catch (e) {}
  const showRawDataFromUrl = new URLSearchParams(window.location.href).get("showRawData");

  if (hit !== undefined) {
    const display = (desc, value, valFunc) => {
      if (value && valFunc === undefined && Array.isArray(value) === false) {
        return (
          <div>
            <b>{desc}:</b> {value}
          </div>
        );
      } else if (value && valFunc === undefined && Array.isArray(value) === true) {
        return (
          <div>
            <b>{desc}:</b> {value.join(", ")}
          </div>
        );
      } else if (value && valFunc !== undefined) {
        return (
          <div>
            <b>{desc}:</b> {valFunc(value)}
          </div>
        );
      }
    };
    let rawDataDesc = "Rohdaten ";
    const item = hit.properties;
    let subSections = [],
      mainSection = <div />,
      title = "Info";
    switch (hit.featuretype) {
      case "tdta_leuchten":
        ({ subSections, mainSection, title } = getLayout4Leuchte({ feature: hit, jwt, dispatch }));
        rawDataDesc += "der Leuchte";
        break;
      case "Leitung":
      case "leitung":
        rawDataDesc += "der Leitung";

        break;
      case "mauerlasche":
        ({ subSections, mainSection, title } = getLayout4Mauerlasche({
          feature: hit,
          jwt,
          dispatch,
        }));

        rawDataDesc += "der Mauerlasche";

        break;
      case "schaltstelle":
        rawDataDesc += "der Schaltstelle";
        ({ subSections, mainSection, title } = getLayout4Schaltstelle({
          feature: hit,
          jwt,
          dispatch,
        }));

        break;
      case "abzweigdose":
        rawDataDesc += "der Abzweigdose";

        break;
      case "tdta_standort_mast":
        ({ subSections, mainSection, title } = getLayout4Standort({
          feature: hit,
          jwt,
          dispatch,
        }));

        rawDataDesc += "des Masts/Standorts";

        break;
      default:
    }

    if (showRawData || showRawDataFromUrl === "") {
      //remove the geometries
      const hitForRawDisplay = JSON.parse(JSON.stringify(hit.properties));

      delete hitForRawDisplay.geojson;
      delete hitForRawDisplay.full_tdta_standort_mast;

      subSections.push(
        <SecondaryInfoPanelSection key='standort' bsStyle='light' header={rawDataDesc}>
          <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>
            <pre key='hitObject'>{JSON.stringify(hitForRawDisplay, null, 2)}</pre>
            {/* <pre key='hits'>{JSON.stringify(hitsForRawDisplay, null, 2)}</pre> */}
          </div>
        </SecondaryInfoPanelSection>
      );
    }

    return (
      <SecondaryInfo
        visible={true}
        setVisibleState={(state) => {
          dispatch(setSecondaryInfoVisible(state));
        }}
        titleIconName='info-circle'
        title={title}
        mainSection={
          <div style={{ fontSize: "115%", padding: "10px", paddingTop: "0px" }}>{mainSection}</div>
        }
        subSections={subSections}
        footer={footer}
      />
    );
  } else {
    return null;
  }
};
export default InfoPanel;
