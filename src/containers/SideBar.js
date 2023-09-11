import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tabs } from "antd";
import { createRef, React, useEffect, useRef, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import { useDispatch, useSelector } from "react-redux";

import SideBarListElement from "../components/commons/SideBarListElement";
import {
  getDones,
  getFeatureCollection,
  getFeatureCollectionInfo,
  getFeatureCollectionMode,
  getFeatureCollections,
  getSelectedFeature,
  MODES,
  setMode,
} from "../core/store/slices/featureCollection";
import { fitBoundsForCollection } from "../core/store/slices/map";

//---------
const { TabPane } = Tabs;

const featureTypeToName = {};
featureTypeToName["tdta_leuchten"] = "Leuchten";
featureTypeToName["schaltstelle"] = "Schaltstellen";
featureTypeToName["mauerlasche"] = "Mauerlaschen";
featureTypeToName["abzweigdose"] = "Abzweigdosen";
featureTypeToName["leitung"] = "Leitungen";
featureTypeToName["tdta_standort_mast"] = "Masten";
featureTypeToName["arbeitsauftrag"] = "Arbeitsaufträge";
featureTypeToName["arbeitsprotokoll"] = "Protokolle";

const SideBar = ({ innerRef, height }) => {
  const featureCollection = useSelector(getFeatureCollection);
  const mode = useSelector(getFeatureCollectionMode);
  const selectedFeature = useSelector(getSelectedFeature);
  const featureCollections = useSelector(getFeatureCollections);
  const featureCollectionInfo = useSelector(getFeatureCollectionInfo);
  const dones = useSelector(getDones);
  const [refs, setRefs] = useState({});
  const listRef = useRef();
  useEffect(() => {
    const _refs = {};
    for (const f of featureCollection) {
      _refs[f.id] = createRef();
    }

    setRefs(_refs);
  }, [featureCollection]);

  //
  const dispatch = useDispatch();
  useEffect(() => {
    if (selectedFeature !== null) {
      if (
        refs &&
        refs[selectedFeature.id] &&
        refs[selectedFeature.id]?.current?.scrollIntoView
      ) {
        const { top: topOfListItem, height: heightOfListItem } =
          refs[selectedFeature.id].current.getBoundingClientRect();
        const { height: heightOfList } =
          listRef?.current.getBoundingClientRect();
        if (
          topOfListItem < heightOfListItem ||
          topOfListItem + heightOfListItem > heightOfList
        ) {
          refs[selectedFeature.id].current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }
  }, [selectedFeature, refs]);

  const mapStyle = {
    width: "300px",
    height,
    overflowY: "auto",
  };

  let currentFeatureType = null;

  if (featureCollectionInfo) {
    const list = (
      <div ref={listRef} style={mapStyle}>
        <ListGroup>
          {featureCollection.map((feature, index) => {
            if (
              currentFeatureType === null ||
              currentFeatureType !== feature.featuretype
            ) {
              currentFeatureType = feature.featuretype;
              return (
                <div key={"listItemDiv." + feature.id} ref={refs[feature.id]}>
                  <ListGroup.Item
                    key={"listItem." + feature.id}
                    style={{
                      textAlign: "left",
                      padding: "0px 0px 0px 10px",
                      background: "#f8f9fa",
                    }}
                  >
                    <b>
                      {
                        featureTypeToName[currentFeatureType] === undefined
                          ? currentFeatureType
                          : featureTypeToName[currentFeatureType]
                        // +
                        // " " +
                        // featureCollectionInfo.typeCount[currentFeatureType]
                      }
                    </b>
                  </ListGroup.Item>
                  <SideBarListElement
                    feature={feature}
                    selected={feature.selected}
                  ></SideBarListElement>
                </div>
              );
            } else {
              return (
                <div key={"listItemDiv." + feature.id} ref={refs[feature.id]}>
                  <SideBarListElement
                    key={"SideBarListElement." + feature.id}
                    feature={feature}
                    selected={feature.selected}
                  ></SideBarListElement>
                </div>
              );
            }
          })}
        </ListGroup>
      </div>
    );

    return (
      <>
        {/* <Nav className="col-md-12 d-none d-md-block bg-light sidebar" */}
        <Nav
          ref={innerRef}
          className="d-md-block bg-light sidebar"
          activeKey="/home"
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <Tabs
            centered
            activeKey={mode}
            onTabClick={(key) => {
              if (key === mode) {
                dispatch(fitBoundsForCollection());
              } else {
                dispatch(setMode(key));
              }
            }}
          >
            <TabPane
              tab={
                <div>
                  {dones[MODES.OBJECTS] === false ? (
                    <FontAwesomeIcon
                      className="text-primary"
                      spin
                      icon={faSpinner}
                    />
                  ) : (
                    featureCollections[MODES.OBJECTS].length
                  )}
                  <br></br>Objekte
                </div>
              }
              key={MODES.OBJECTS}
            >
              {list}
            </TabPane>
            <TabPane
              tab={
                <div>
                  {dones[MODES.TASKLISTS] === false ? (
                    <FontAwesomeIcon
                      className="text-primary"
                      spin
                      icon={faSpinner}
                    />
                  ) : (
                    featureCollections[MODES.TASKLISTS].length
                  )}
                  <br></br>
                  {featureCollections[MODES.TASKLISTS].length === 1
                    ? "Arbeitsauftrag"
                    : "Arbeitsaufträge"}
                </div>
              }
              key={MODES.TASKLISTS}
              disabled={!(featureCollections[MODES.TASKLISTS].length > 0)}
            >
              {list}
            </TabPane>
            <TabPane
              tab={
                <div>
                  {dones[MODES.PROTOCOLS] === false ? (
                    <FontAwesomeIcon
                      className="text-primary"
                      spin
                      icon={faSpinner}
                    />
                  ) : featureCollections[MODES.PROTOCOLS].length > 0 ? (
                    featureCollections[MODES.PROTOCOLS].length
                  ) : (
                    "-"
                  )}
                  <br></br>
                  {featureCollections[MODES.PROTOCOLS].length === 1
                    ? "Protokoll"
                    : "Protokolle"}
                </div>
              }
              key={MODES.PROTOCOLS}
              disabled={!(featureCollections[MODES.PROTOCOLS].length > 0)}
            >
              {list}
            </TabPane>
          </Tabs>
        </Nav>
      </>
    );
  } else {
    return null;
  }
};
export default SideBar;
