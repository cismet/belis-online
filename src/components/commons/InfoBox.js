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
import AddIncidentDialog, { ADD_INCIDENT_MODES } from "../app/dialogs/AddIncident";
import { getWebDavUrl } from "../../constants/belis";

import { LightBoxDispatchContext } from "react-cismap/contexts/LightBoxContextProvider";

import { addDotThumbnail } from "./secondaryinfo/components/helper";
import { getDB, addImageToObjectAction } from "../../core/store/slices/offlineActionDb";
import { bufferBBox } from "../../core/helper/gisHelper";
import { zoomToFeature } from "../../core/helper/mapHelper";
import {
  selectNextFeature,
  selectPreviousFeature,
} from "../../core/helper/featureCollectionHelper";

import { Menu, Dropdown } from "antd";
import { faAsterisk, faFileInvoice, faInbox, faPlus } from "@fortawesome/free-solid-svg-icons";

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
  const { setAll: setPhotoLightBoxData, setVisible, setCaptions } = useContext(
    LightBoxDispatchContext
  );
  const selectedArbeitsauftrag = useSelector(
    (state) => state.featureCollection.selectedFeature[FEATURECOLLECTION_MODES.TASKLISTS]
  );
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
  let actionLinkInfos = [];

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
    setCaptions(captions);
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

    actionLinkInfos = [
      {
        tooltip: "Auf Objekt zoomen",
        onClick: () => {
          zoomToFeature({
            feature: selectedFeature,
            mapRef: refRoutedMap.current.leafletMap.leafletElement,
          });
        },
        iconname: "search-location",
      },
    ];

    if (mode === FEATURECOLLECTION_MODES.OBJECTS) {
      if (
        selectedFeature?.featuretype !== "Leitung" &&
        selectedFeature?.featuretype !== "abzweigdose"
      )
        actionLinkInfos.push({
          tooltip: "Öffne Datenblatt",
          onClick: () => {
            dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
          },
          iconname: "info",
        });

      actionLinkInfos.push({
        tooltip: "Foto hinzufügen",
        onClick: () => {
          const dialog = (
            <AddImageDialog
              close={() => {
                dispatch(showDialog());
              }}
              input={{ feature: selectedFeature, vcard }}
              onClose={(addImageParamater) => {
                dispatch(addImageToObjectAction(addImageParamater));
              }}
            />
          );
          dispatch(showDialog(dialog));
        },
        iconname: "camera",
      });

      let subs = [
        {
          tooltip: "Nur Veranlassung",
          title: "Nur Veranlassung",
          iconspan: (
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faInbox}></FontAwesomeIcon>
            </span>
          ),
          onClick: () => {
            const dialog = (
              <AddIncidentDialog
                close={() => {
                  dispatch(showDialog());
                }}
                input={{ feature: selectedFeature, vcard, mode: ADD_INCIDENT_MODES.VERANLASSUNG }}
                onClose={(params) => {
                  console.log("addIncident", params);
                }}
              />
            );
            console.log("Störung melden", dialog);
            dispatch(showDialog(dialog));
          },
        },
        {
          tooltip: "Einzelauftrag",
          title: "Einzelauftrag",
          iconspan: (
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faAsterisk} transform='shrink-9 right-11 up-5' />
            </span>
          ),
          onClick: () => {
            const dialog = (
              <AddIncidentDialog
                close={() => {
                  dispatch(showDialog());
                }}
                input={{ feature: selectedFeature, vcard, mode: ADD_INCIDENT_MODES.EINZELAUFTRAG }}
                onClose={(params) => {
                  console.log("addIncident", params);
                }}
              />
            );
            console.log("Störung melden", dialog);
            dispatch(showDialog(dialog));
          },
        },
      ];
      console.log("selectedArbeitsauftrag", selectedArbeitsauftrag);

      if (selectedArbeitsauftrag) {
        subs.push({
          tooltip: "Arbeitsauftrag ergänzen",
          title: selectedArbeitsauftrag.properties.nummer + " ergänzen",
          // iconname: "exclamation-triangle",
          iconspan: (
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faFileInvoice}></FontAwesomeIcon>
              <FontAwesomeIcon icon={faPlus} transform='shrink-9 right-10 up-5' />
            </span>
          ),
          onClick: () => {
            const dialog = (
              <AddIncidentDialog
                close={() => {
                  dispatch(showDialog());
                }}
                input={{
                  feature: selectedFeature,
                  vcard,
                  mode: ADD_INCIDENT_MODES.ADD2ARBEITSAUFTRAG,
                  arbeitsauftrag: selectedArbeitsauftrag,
                }}
                onClose={(params) => {
                  console.log("addIncident", params);
                }}
              />
            );
            console.log("Störung melden", dialog);
            dispatch(showDialog(dialog));
          },
        });
      }

      actionLinkInfos.push({
        tooltip: "Störung meldenn",
        subs,
        iconname: "exclamation-triangle",
      });
    } else if (mode === FEATURECOLLECTION_MODES.TASKLISTS) {
      actionLinkInfos.push({
        tooltip: "Öffne Datenblatt",
        onClick: () => {
          dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
        },
        iconname: "info",
      });
    } else {
      //Protocols
      actionLinkInfos.push({
        tooltip: "Öffne Datenblatt",
        onClick: () => {
          dispatch(setSecondaryInfoVisible(!secondaryInfoVisible));
        },
        iconname: "info",
      });
      actionLinkInfos.push({
        tooltip: "Aktionen",
        onClick: () => {},
        iconname: "list-alt",
      });
      actionLinkInfos.push({
        tooltip: "Status ändern",
        onClick: () => {},
        iconname: "list-alt",
      });
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
                  {actionLinkInfos.map((li, index) => {
                    if (li.subs) {
                    } else {
                      return (
                        <span style={{ paddingLeft: index > 0 ? 3 : 0 }}>
                          <IconLink
                            key={`iconlink` + index}
                            tooltip={li.tooltip}
                            onClick={li.onClick}
                            iconname={li.iconname}
                            href='#'
                          />
                        </span>
                      );
                    }
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
  console.log("selectedFeature", selectedFeature);
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
              {actionLinkInfos.map((li, index) => {
                if (li.subs) {
                  console.log("li.subs", li.subs);

                  const items = li.subs.map((sub, index) => {
                    return {
                      key: index,
                      label: (
                        <h3 onClick={sub.onClick}>
                          <span
                            style={{
                              marginRight: 10,
                              opacity: 0.5,
                            }}
                          >
                            {sub.iconname && <Icon name={sub.iconname} />}
                            {sub.iconspan && sub.iconspan}
                          </span>
                          {sub.title}
                        </h3>
                      ),
                    };
                  });

                  const menu = <Menu style={{ opacity: 0.8 }} items={items} />;

                  return (
                    <Dropdown overlay={menu} placement='topRight' trigger={["click"]}>
                      <Button
                        style={{
                          opacity: 0.7,
                          marginLeft: index === 0 ? 0 : 5,
                          marginRight: index === actionLinkInfos.length - 1 ? 0 : 5,
                          width: "100%",
                        }}
                        key={"actionbutton." + index}
                        size='lg'
                        variant='light'
                        tooltip={li.tooltip}
                      >
                        <h2>
                          <Icon name={li.iconname} />
                        </h2>
                      </Button>
                    </Dropdown>
                  );
                } else {
                  return (
                    <Button
                      style={{
                        opacity: 0.7,
                        marginLeft: index === 0 ? 0 : 5,
                        marginRight: index === actionLinkInfos.length - 1 ? 0 : 5,
                        width: "100%",
                      }}
                      key={"actionbutton." + index}
                      size='lg'
                      variant='light'
                      onClick={li.onClick}
                      tooltip={li.tooltip}
                    >
                      <h2>
                        <Icon name={li.iconname} />
                      </h2>
                    </Button>
                  );
                }
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
