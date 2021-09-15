import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeatureCollection,
  getSelectedFeature,
  setSelectedFeature,
  isSecondaryInfoVisible,
  setSecondaryInfoVisible,
} from "../../core/store/slices/featureCollection";
// import ResponsiveInfoBox from "./ResponsiveInfoBox";
import ResponsiveInfoBox, { MODES } from "react-cismap/topicmaps/ResponsiveInfoBox";

import { getActionLinksForFeature } from "react-cismap/tools/uiHelper";
import { getVCard } from "../../core/helper/featureHelper";
import { projectionData } from "react-cismap/constants/gis";
import { convertBBox2Bounds } from "react-cismap/tools/gisHelper";
import { getType } from "@turf/invariant";
import proj4 from "proj4";
import envelope from "@turf/envelope";

import IconLink from "react-cismap/commons/IconLink";
import { UIContext, UIDispatchContext } from "react-cismap/contexts/UIContextProvider";

//---

const InfoBox = ({ refRoutedMap }) => {
  const dispatch = useDispatch();
  const featureCollection = useSelector(getFeatureCollection);
  const selectedFeature = useSelector(getSelectedFeature);
  const secondaryInfoVisible = useSelector(isSecondaryInfoVisible);
  const { setCollapsedInfoBox } = useContext(UIDispatchContext);
  const { collapsedInfoBox } = useContext(UIContext);

  let header = <span>Feature title</span>;
  const minified = collapsedInfoBox;
  const minify = setCollapsedInfoBox;
  const infoStyle = {};
  let divWhenLarge;
  let divWhenCollapsed;

  let collapsibleDiv;
  let title = "feature title";
  let subtitle = "feature subtitle";
  let additionalInfo = "info";
  let hideNavigator = false;
  let links = [];

  const _next = () => {
    if (featureCollection) {
      const newIndex = (selectedFeature.index + 1) % featureCollection.length;
      dispatch(setSelectedFeature(featureCollection[newIndex]));
    }
  };
  const _previous = () => {
    if (featureCollection) {
      let newIndex = (selectedFeature.index - 1) % featureCollection.length;
      if (newIndex === -1) {
        newIndex = featureCollection.length - 1;
      }
      dispatch(setSelectedFeature(featureCollection[newIndex]));
    }
  };

  // let _previous = () => {
  //   let last = undefined;
  //   if (featureCollection) {
  //     for (const feature of featureCollection) {
  //       if (feature.selected === true) {
  //         if (last) {
  //           dispatch(setSelectedFeature(last));
  //         }
  //         return;
  //       }
  //       last = feature;
  //     }
  //   }
  // };
  // let _next = () => {
  //   let isNext = false;
  //   if (featureCollection) {
  //     for (const feature of featureCollection) {
  //       if (isNext) {
  //         dispatch(setSelectedFeature(feature));
  //         return;
  //       }
  //       if (feature.selected === true) {
  //         isNext = true;
  //       }
  //     }
  //   }
  // };
  let currentlyShownCountLabel = featureCollection.length + " Objekte gefunden";
  let noCurrentFeatureTitle = "no title";
  let noCurrentFeatureContent = "no content";

  const config = {
    city: "gesamtem Bereich verfügbar",
    header: "Information zum Objekt",
    navigator: {
      noun: {
        singular: "Objekt",
        plural: "Objekte",
      },
    },
    noCurrentFeatureTitle: "Keine Objekte gefunden",
    noCurrentFeatureContent: "",
    displaySecondaryInfoAction: false,
  };

  if (selectedFeature !== undefined && selectedFeature !== null) {
    let vcard = getVCard(selectedFeature);
    header = <span>Feature{vcard?.title}</span>;

    links = getActionLinksForFeature(selectedFeature, {
      entityClassName: config.navigator.noun.singular,
      displayZoomToFeature: true,
      zoomToFeature: (feature) => {
        let zoomlevel = 22;
        let refDef;
        if (feature.crs) {
          const code = feature?.crs?.properties?.name?.split("EPSG::")[1];
          refDef = projectionData[code].def;
        } else {
          refDef = projectionData["25832"].def;
        }

        if (refRoutedMap !== undefined) {
          const type = getType(feature);
          if (type === "Point") {
            const pos = proj4(refDef, proj4.defs("EPSG:4326"), [
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1],
            ]);

            refRoutedMap.current.leafletMap.leafletElement.setView([pos[1], pos[0]], zoomlevel);
          } else {
            refRoutedMap.current.leafletMap.leafletElement.fitBounds(
              convertBBox2Bounds(envelope(feature.feature).bbox, refDef)
            );
          }
        }
      },
      displaySecondaryInfoAction:
        config.displaySecondaryInfoAction === true ||
        config.displaySecondaryInfoAction === undefined,
      setVisibleStateOfSecondaryInfo: (vis) => {
        return false;
      },
    });
    links.push(
      <IconLink
        key={`openInfo`}
        tooltip={"Öffne Datenblatt"}
        onClick={() => {
          dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
        }}
        iconname={"info"}
        href='#'
      />
    );
    header = <span>{vcard?.title || config.header}</span>;
    title = vcard?.title;
    subtitle = vcard?.subtitle;
    additionalInfo = vcard?.location;
  }

  let llVis = (
    <table style={{ width: "100%" }}>
      <tbody>
        <tr>
          <td
            style={{
              textAlign: "left",
              verticalAlign: "top",
              background: "#dddddd",
              color: "black",
              opacity: "0.9",
              paddingLeft: "3px",
              paddingTop: "0px",
              paddingBottom: "0px",
            }}
          >
            {header}
          </td>
        </tr>
      </tbody>
    </table>
  );

  if (selectedFeature) {
    const navigator = (
      <table style={{ width: "100%", marginBottom: 0 }}>
        <tbody>
          <tr>
            <td title='vorheriger Treffer' style={{ textAlign: "left", verticalAlign: "center" }}>
              <a className='renderAsProperLink' onClick={_previous}>
                &lt;&lt;
              </a>
            </td>
            <td style={{ textAlign: "center", verticalAlign: "center" }}>
              {currentlyShownCountLabel}
            </td>

            <td title='nächster Treffer' style={{ textAlign: "right", verticalAlign: "center" }}>
              <a className='renderAsProperLink' onClick={_next}>
                &gt;&gt;
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    );

    divWhenCollapsed = (
      <div>
        <table border={0} style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td
                style={{
                  textAlign: "left",
                  padding: "1px",
                  maxWidth: "160px",
                  overflowWrap: "break-word",
                }}
              >
                <h5>
                  <b>{title}</b>
                </h5>
              </td>
              <td style={{ textAlign: "right", paddingRight: 7 }}>{[links]}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginRight: 9, backgrosundColor: "red" }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "left", verticalAlign: "top" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <h6>
                            {/* {additionalInfo &&
                            additionalInfo.startsWith &&
                            additionalInfo.startsWith("<html>") && (
                              <div>{parseHtml(additionalInfo.match(/<html>(.*?)<\/html>/)[1])}</div>
                            )} */}
                            {additionalInfo &&
                              (!additionalInfo.toString().startsWith ||
                                !additionalInfo.toString().startsWith("<html>")) &&
                              additionalInfo
                                .toString()
                                .split("\n")
                                .map((item, key) => {
                                  return (
                                    <span key={key}>
                                      {item}
                                      <br />
                                    </span>
                                  );
                                })}
                          </h6>
                          {/* {subtitle && subtitle.startsWith && subtitle.startsWith("<html>") && (
                          <div> {parseHtml(subtitle.match(/<html>(.*?)<\/html>/)[1])}</div>
                        )} */}
                          {subtitle && (!subtitle.startsWith || !subtitle.startsWith("<html>")) && (
                            <p>{subtitle}</p>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          <div>{navigator}</div>
        </div>
      </div>
    );

    divWhenLarge = divWhenCollapsed;
  } else {
    divWhenCollapsed = noCurrentFeatureTitle;
    collapsibleDiv = <div style={{ paddingRight: 2 }}>{noCurrentFeatureContent}</div>;
  }

  return (
    <ResponsiveInfoBox
      pixelwidth={350}
      header={llVis}
      mode={MODES.AB}
      collapsedInfoBox={minified}
      setCollapsedInfoBox={minify}
      isCollapsible={true}
      handleResponsiveDesign={false}
      infoStyle={infoStyle}
      divWhenCollapsed={divWhenCollapsed}
      divWhenLarge={divWhenLarge}
      fixedRow={true}
    />
  );
};

export default InfoBox;
