import { createRef, React, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import SideBarListElement from "../components/commons/SideBarListElement";
import ListGroup from "react-bootstrap/ListGroup";
import {
  getFeatureCollection,
  getFeatureCollectionInfo,
  getSelectedFeature,
} from "../core/store/slices/featureCollection";

//---------

const featureTypeToName = {};
featureTypeToName["tdta_leuchten"] = "Leuchten";
featureTypeToName["schaltstelle"] = "Schaltstellen";
featureTypeToName["mauerlasche"] = "Mauerlaschen";
featureTypeToName["abzweigdose"] = "Abzweigdosen";
featureTypeToName["Leitung"] = "Leitungen";
featureTypeToName["tdta_standort_mast"] = "Masten";

const SideBar = ({ innerRef, height }) => {
  const [allFeatures, setAllFeatures] = useState([]);
  const featureCollection = useSelector(getFeatureCollection);
  const selectedFeature = useSelector(getSelectedFeature);
  const featureCollectionInfo = useSelector(getFeatureCollectionInfo);
  const [refs, setRefs] = useState({});

  useEffect(() => {
    const _refs = {};
    for (const f of featureCollection) {
      _refs[f.id] = createRef();
    }

    setRefs(_refs);
  }, [featureCollection]);

  useEffect(() => {
    if (selectedFeature !== null) {
      refs &&
        refs[selectedFeature.id] &&
        refs[selectedFeature.id]?.current?.scrollIntoView &&
        refs[selectedFeature.id].current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  }, [selectedFeature, refs]);

  const mapStyle = {
    width: "300px",
    height,
    overflowY: "auto",
  };

  if (allFeatures !== featureCollection) {
    setAllFeatures(featureCollection);
  }

  let currentFeatureType = null;

  if (featureCollectionInfo) {
    return (
      <>
        {/* <Nav className="col-md-12 d-none d-md-block bg-light sidebar" */}
        <Nav
          ref={innerRef}
          className='d-md-block bg-light sidebar'
          activeKey='/home'
          onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
        >
          <div style={mapStyle}>
            <ListGroup>
              {featureCollection.map((feature, index) => {
                if (currentFeatureType === null || currentFeatureType !== feature.featuretype) {
                  currentFeatureType = feature.featuretype;

                  return (
                    <div ref={refs[feature.id]}>
                      <ListGroup.Item
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
                    <div ref={refs[feature.id]}>
                      <SideBarListElement
                        feature={feature}
                        selected={feature.selected}
                      ></SideBarListElement>
                    </div>
                  );
                }
              })}
            </ListGroup>
          </div>
        </Nav>
      </>
    );
  } else {
    return null;
  }
};
export default SideBar;
