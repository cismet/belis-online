import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFeatureCollection,
  getSelectedFeature,
  setSelectedFeature,
  isSecondaryInfoVisible,
  setSecondaryInfoVisible,
  getFeatureCollectionMode,
} from "../../core/store/slices/featureCollection";
// import ResponsiveInfoBox from "./ResponsiveInfoBox";
import ResponsiveInfoBox, { MODES } from "react-cismap/topicmaps/ResponsiveInfoBox";

import { MODES as FEATURECOLLECTION_MODES } from "../../core/store/slices/featureCollection";
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

import { useEffect } from "react";
import { useState } from "react";
import { getJWT, getLoginFromJWT } from "../../core/store/slices/auth";
import { showDialog } from "../../core/store/slices/app";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf } from "@fortawesome/free-regular-svg-icons";
import Button from "react-bootstrap/Button";
import AddImageDialog from "../app/dialogs/AddImage";
import { getWebDavUrl } from "../../constants/belis";

import { LightBoxDispatchContext } from "react-cismap/contexts/LightBoxContextProvider";

import { addDotThumbnail } from "./secondaryinfo/components/helper";
import { getDB, processAddImageToObject } from "../../core/store/slices/offlineActionDb";
import { bufferBBox } from "../../core/helper/gisHelper";
import { zoomToFeature } from "../../core/helper/mapHelper";
import {
  selectNextFeature,
  selectPreviousFeature,
} from "../../core/helper/featureCollectionHelper";

//---

const InfoBox = ({ refRoutedMap }) => {
  let vcard;
  const dispatch = useDispatch();
  const featureCollection = useSelector(getFeatureCollection);
  const jwt = useSelector(getJWT);
  const selectedFeature = useSelector(getSelectedFeature);
  const secondaryInfoVisible = useSelector(isSecondaryInfoVisible);
  const { setCollapsedInfoBox } = useContext(UIDispatchContext);
  const { collapsedInfoBox } = useContext(UIContext);
  const mode = useSelector(getFeatureCollectionMode);
  const { setAll: setPhotoLightBoxData, setVisible } = useContext(LightBoxDispatchContext);

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

  // const lightBoxDispatchContext = useContext(LightBoxDispatchContext);
  const pixelwidth = 350;

  useEffect(() => {
    const photourls = [];

    const captions = [];

    // collect all photo urls from selected feature
    for (const doc of selectedFeature.properties.docs || []) {
      let openPDFLink;
      if (doc.intermediate) {
        photourls.push(doc.url);
      } else {
        let url = getWebDavUrl(jwt, doc);

        if (url.endsWith(".jpg")) {
          url += ".thumbnail.jpg";
        } else if (url.endsWith(".png")) {
          url += ".thumbnail.png";
        } else if (url.endsWith(".pdf")) {
          url += ".thumbnail.jpg";
        } else {
        }
        photourls.push(url);

        if (doc?.doc && doc?.doc.endsWith(".pdf")) {
          openPDFLink = (
            <span style={{ marginLeft: 30 }}>
              <a href={getWebDavUrl(jwt, doc)} target='_pdf'>
                PDF extern öffnen
              </a>
            </span>
          );
        }
      }
      captions.push(
        doc.description ? (
          <div>
            {doc.description}
            {doc.intermediate === true && "*"} ({doc.caption}) {openPDFLink}
          </div>
        ) : (
          <div>
            {doc.caption}
            {doc.intermediate === true && "*"} {openPDFLink}
          </div>
        )
      );
    }

    setPhotoLightBoxData({
      title: vcard?.infobox?.title,
      index: 0,
      photourls,
      caption: captions,
      visible: false,
    });
  }, [selectedFeature, jwt, dispatch, vcard]);

  const setLightBoxVisible = (visible) => {
    console.log("xxx setvisible", visible);

    setVisible(visible);
  };

  const _next = () => {
    selectNextFeature({
      featureCollection,
      selectedFeature,
      dispatch,
      setSelectedFeature,
    });
  };
  const _previous = () => {
    selectPreviousFeature({
      featureCollection,
      selectedFeature,
      dispatch,
      setSelectedFeature,
    });
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

  if (selectedFeature !== undefined && selectedFeature !== null) {
    vcard = getVCard(selectedFeature);
    header = <span>Feature{vcard}</span>;

    links = getActionLinksForFeature(selectedFeature, {
      entityClassName: config.navigator.noun.singular,
      displayZoomToFeature: true,
      zoomToFeature: (feature) => {
        zoomToFeature({ feature, mapRef: refRoutedMap.current.leafletMap.leafletElement });
      },
      displaySecondaryInfoAction: false,
      setVisibleStateOfSecondaryInfo: (vis) => {
        return false;
      },
    });

    if (mode === FEATURECOLLECTION_MODES.OBJECTS) {
      if (
        selectedFeature?.featuretype !== "Leitung" &&
        selectedFeature?.featuretype !== "abzweigdose"
      )
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
                  input={{ feature: selectedFeature, vcard }}
                  onClose={(addImageParamater) => {
                    dispatch(processAddImageToObject(addImageParamater));
                  }}
                />
              )
            );
          }}
          iconname={"camera"}
          href='#'
        />
      );

      links.push(
        <IconLink
          key={`addIncident`}
          tooltip={"Störung melden"}
          onClick={() => {
            // dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
          }}
          iconname={"exclamation-triangle"}
          href='#'
        />
      );
    } else if (mode === FEATURECOLLECTION_MODES.TASKLISTS) {
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
    } else {
      //Protocolls
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
        <IconLink
          key={`protocolAction`}
          tooltip={"Aktionen"}
          onClick={() => {
            // dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
          }}
          iconname={"list-alt"}
          href='#'
        />
      );
      links.push(
        <IconLink
          key={`statusAction`}
          tooltip={"Status ändern"}
          onClick={() => {
            // dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
          }}
          iconname={"comment"}
          href='#'
        />
      );
    }

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

  return (
    <div>
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
          selectedFeature?.properties?.docs &&
          selectedFeature.properties.docs.length > 0 &&
          selectedFeature.properties.docs[0] ? (
            <div style={{ position: "relative" }}>
              {selectedFeature.properties.docs[0].doc?.endsWith(".pdf") && (
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
                src={addDotThumbnail(getWebDavUrl(jwt, selectedFeature.properties.docs[0]))}
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
