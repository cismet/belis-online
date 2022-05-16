import { createRef, React, useEffect, useRef, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { Tabs } from "antd";

import { useDispatch, useSelector } from "react-redux";
import SideBarListElement from "../components/commons/SideBarListElement";
import ListGroup from "react-bootstrap/ListGroup";
import {
  getFeatureCollection,
  getFeatureCollectionInfo,
  getSelectedFeature,
  MODES,
  setMode,
} from "../core/store/slices/featureCollection";
//---------
const { TabPane } = Tabs;

const featureTypeToName = {};
featureTypeToName["tdta_leuchten"] = "Leuchten";
featureTypeToName["schaltstelle"] = "Schaltstellen";
featureTypeToName["mauerlasche"] = "Mauerlaschen";
featureTypeToName["abzweigdose"] = "Abzweigdosen";
featureTypeToName["Leitung"] = "Leitungen";
featureTypeToName["tdta_standort_mast"] = "Masten";

const SideBar = ({ innerRef, height }) => {
  const featureCollection = useSelector(getFeatureCollection);
  const selectedFeature = useSelector(getSelectedFeature);
  const featureCollectionInfo = useSelector(getFeatureCollectionInfo);
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
      if (refs && refs[selectedFeature.id] && refs[selectedFeature.id]?.current?.scrollIntoView) {
        const { top: topOfListItem, height: heightOfListItem } = refs[
          selectedFeature.id
        ].current.getBoundingClientRect();
        const { height: heightOfList } = listRef?.current.getBoundingClientRect();
        if (topOfListItem < heightOfListItem || topOfListItem + heightOfListItem > heightOfList) {
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
            if (currentFeatureType === null || currentFeatureType !== feature.featuretype) {
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
                      {(featureTypeToName[currentFeatureType] === undefined
                        ? currentFeatureType
                        : featureTypeToName[currentFeatureType]) +
                        " " +
                        featureCollectionInfo.typeCount[currentFeatureType]}
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
          className='d-md-block bg-light sidebar'
          activeKey='/home'
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <Tabs
            centered
            defaultActiveKey='1'
            onChange={(key) => {
              dispatch(setMode(key));
            }}
          >
            <TabPane tab='Objekte' key={MODES.OBJECTS}>
              {list}
            </TabPane>
            <TabPane tab='Arbeitsaufträge' key={MODES.TASKLISTS}>
              {list}
            </TabPane>
            <TabPane tab='Protokolle' key={MODES.PROTOCOLLS}>
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
