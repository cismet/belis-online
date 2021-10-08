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
import Icon from "react-cismap/commons/Icon";

import PhotoLightBox from "react-cismap/topicmaps/PhotoLightbox";
import { useEffect } from "react";
import { useState } from "react";
import { getJWT } from "../../core/store/slices/auth";
import { showDialog } from "../../core/store/slices/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import AddImageDialog from "../app/dialogs/AddImage";

//---

const InfoBox = ({ refRoutedMap }) => {
  const dispatch = useDispatch();
  const featureCollection = useSelector(getFeatureCollection);
  const jwt = useSelector(getJWT);
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

  let [lightBoxVisible, setLightBoxVisible] = useState(false);
  let [lightBoxIndex, setLightBoxIndex] = useState(0);

  // const lightBoxDispatchContext = useContext(LightBoxDispatchContext);
  const pixelwidth = 350;
  useEffect(() => {
    setLightBoxIndex(0);
  }, [selectedFeature]);
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
  let vcard;
  let imageUrls = [];
  let imageCaptions = [];

  if (selectedFeature !== undefined && selectedFeature !== null) {
    vcard = getVCard(selectedFeature);
    header = <span>Feature{vcard}</span>;

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
    links.push(
      // <input accept='image/*' id='icon-button-file' type='file' capture='environment' />
      <IconLink
        key={`addPhoto`}
        tooltip={"Foto hinzufügen"}
        onClick={() => {
          dispatch(
            showDialog(
              <AddImageDialog
                close={() => {
                  dispatch(showDialog());
                }}
                input={{ selectedFeature, vcard }}
                onClose={(output) => {
                  console.log("add Photo output", output);
                }}
              />
            )
          );
        }}
        iconname={"camera"}
        href='#'
      />
    );
    // links.push(
    //   <IconLink
    //     key={`addPhot`}
    //     tooltip={"Störung melden"}
    //     onClick={() => {
    //       dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
    //     }}
    //     iconname={"exclamation-triangle"}
    //     href='#'
    //   />
    // );
    header = <span>{vcard?.infobox?.header || config.header}</span>;
    title = vcard?.infobox?.title;
    subtitle = vcard?.infobox?.subtitle;
    additionalInfo = vcard?.infobox?.more;
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
              {minified === true && (
                <td style={{ textAlign: "right", paddingRight: 7 }}>
                  {links.map((link, index) => {
                    return <span style={{ paddingLeft: index > 0 ? 3 : 0 }}>{link}</span>;
                  })}
                </td>
              )}
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

  const photourls = [];
  const originalPhotourls = [];
  const captions = [];
  for (const doc of selectedFeature.properties.docs || []) {
    let url = "https://belis-testapi.cismet.de/secres/" + jwt + "/beliswebdav/" + doc.doc;

    if (url.endsWith(".jpg")) {
      url += ".thumbnail.jpg";
    } else if (url.endsWith(".png")) {
      url += ".thumbnail.png";
    } else if (url.endsWith(".pdf")) {
      url += ".thumbnail.jpg";
    } else {
    }
    photourls.push(url);
    let openPDFLink;
    if (doc?.doc && doc?.doc.endsWith(".pdf")) {
      openPDFLink = (
        <span style={{ marginLeft: 30 }}>
          <a
            href={"https://belis-testapi.cismet.de/secres/" + jwt + "/beliswebdav/" + doc.doc}
            target='_pdf'
          >
            PDF extern öffnen
          </a>
        </span>
      );
    }
    captions.push(
      doc.description ? (
        <div>
          {doc.description} ({doc.caption}) {openPDFLink}
        </div>
      ) : (
        <div>
          {doc.caption} {openPDFLink}
        </div>
      )
    );
  }

  return (
    <div>
      <PhotoLightBox
        defaultContextValues={{
          title: vcard?.infobox?.title,
          photourls,
          captions,
          index: lightBoxIndex,
          visible: lightBoxVisible,
          setVisible: (vis) => {
            setLightBoxVisible(vis);
          },
          setIndex: (i) => {
            setLightBoxIndex(i);
          },
        }}
      />
      <ResponsiveInfoBox
        pixelwidth={pixelwidth}
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
        secondaryInfoBoxElements={[
          minified === false ? (
            <div
              style={{
                width: pixelwidth,
                background_: "red",
                display: "flex",
                justifyContent: "space-between",
                paddingBottom: 5,
              }}
            >
              {links.map((link, index) => {
                return (
                  <Button
                    style={{
                      opacity: 0.7,
                      marginLeft: index === 0 ? 0 : 5,
                      marginRight: index === links.length - 1 ? 0 : 5,
                      width: "100%",
                    }}
                    size='lg'
                    variant='light'
                  >
                    {link}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div />
          ),
          photourls?.length > 0 ? (
            <div style={{ position: "relative" }}>
              {selectedFeature.properties.docs[0].doc.endsWith(".pdf") && (
                <FontAwesomeIcon
                  style={{
                    position: "absolute",
                    bottom: "15",
                    left: "15",
                    zIndex: 100,
                    fontSize: "40px",
                    opacity: "60%",
                  }}
                  icon={faFilePdf}
                  fontSize={30}
                />
              )}
              <img
                alt='Preview'
                width='150'
                style={{ paddingBottom: "5px", opacity: 0.9, display: "block" }}
                onClick={() => {
                  setLightBoxVisible(true);
                }}
                src={photourls[0]}
              />
            </div>
          ) : (
            <div />
          ),
        ]}
      />
    </div>
  );
};

export default InfoBox;
