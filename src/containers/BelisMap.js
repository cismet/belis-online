import React, { useEffect } from "react";
import { MappingConstants, RoutedMap } from "react-cismap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import BelisFeatureCollection from "../components/app/FeatureCollection";
import FocusRectangle from "../components/app/FocusRectangle";
import { backgrounds } from "../constants/belis";
import { modifyQueryPart } from "../core/commons/routingHelper";
import { getConnectionMode } from "../core/store/slices/app";
import { getBackground } from "../core/store/slices/background";
import {
  getFeatureCollection,
  loadObjects,
  isInFocusMode,
  isSecondaryInfoVisible,
  getSelectedFeature,
  setSelectedFeature,
  getOverlayFeature,
  getGazetteerHit,
} from "../core/store/slices/featureCollection";
import { isPaleModeActive } from "../core/store/slices/paleMode";
import { getZoom, setZoom } from "../core/store/slices/zoom";
import InfoBox from "../components/commons/InfoBox";
import InfoPanel from "../components/commons/secondaryinfo/SecondaryInfo";
import ProjSingleGeoJson from "react-cismap/ProjSingleGeoJson";
import GazetteerHitDisplay from "react-cismap/GazetteerHitDisplay";
import { getLineIndex, getLoadingState, getPointIndex } from "../core/store/slices/spatialIndex";

//---

const BelisMap = ({ refRoutedMap, width, height, jwt }) => {
  const dispatch = useDispatch();

  const mapStyle = {
    height,
    width,
    cursor: "pointer",
    clear: "both",
    display: "flex",
  };
  const featureCollection = useSelector(getFeatureCollection);
  const inFocusMode = useSelector(isInFocusMode);
  const secondaryInfoVisible = useSelector(isSecondaryInfoVisible);
  const selectedFeature = useSelector(getSelectedFeature);
  const overlayFeature = useSelector(getOverlayFeature);
  const gazetteerHit = useSelector(getGazetteerHit);
  const loadingState = useSelector(getLoadingState);
  const pointIndex = useSelector(getPointIndex);
  const lineIndex = useSelector(getLineIndex);
  const history = useHistory();
  const browserlocation = useLocation();

  const zoom = useSelector(getZoom);
  const inPaleMode = useSelector(isPaleModeActive);
  const background = useSelector(getBackground);

  const urlSearchParams = new URLSearchParams(browserlocation.search);

  const rlKey = (inPaleMode === true ? "pale_" : "") + background;

  const resultingLayer = backgrounds[rlKey];

  const boundingBoxChangedHandler = (incomingBoundingBox, force = false) => {
    let boundingBox = incomingBoundingBox;
    if (boundingBox === undefined) {
      boundingBox = refRoutedMap.current.getBoundingBox();
    }
    const z = urlSearchParams.get("zoom");
    if (zoom !== z) {
      dispatch(setZoom(z));
    }
    console.log("zz loadObjects");
    console.log("zz loadingState", loadingState);
    console.log("zz lineIndex", lineIndex);
    console.log("zz pointIndex", pointIndex);
    dispatch(loadObjects({ boundingBox, inFocusMode, zoom: z, jwt: jwt, force }));
  };
  let symbolColor;
  if (background === "nightplan") {
    symbolColor = "#ffffff";
  } else {
    symbolColor = "#000000";
  }

  useEffect(() => {
    if (loadingState === "done" && lineIndex && pointIndex) {
      boundingBoxChangedHandler(undefined, true);
    }
  }, [loadingState, lineIndex, pointIndex]);

  return (
    <RoutedMap
      editable={false}
      style={mapStyle}
      key={"leafletRoutedMap." + inPaleMode + "." + background}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
      ref={refRoutedMap}
      layers=''
      doubleClickZoom={false}
      onclick={(e) => {
        console.log("click");
      }}
      ondblclick={(e) => {
        const classes = e.originalEvent.path[0].getAttribute("class");

        if (classes && classes.split(" ").includes("leaflet-container")) {
          console.log("unselect feature");

          dispatch(setSelectedFeature(null));
        }
      }}
      autoFitProcessedHandler={() => this.props.mappingActions.setAutoFit(false)}
      backgroundlayers={resultingLayer}
      urlSearchParams={urlSearchParams}
      fullScreenControlEnabled={false}
      locateControlEnabled={true}
      minZoom={11}
      maxZoom={22}
      zoomSnap={0.5}
      zoomDelta={0.5}
      locationChangedHandler={(location) => {
        history.push(history.location.pathname + modifyQueryPart(browserlocation.search, location));
      }}
      boundingBoxChangedHandler={boundingBoxChangedHandler}
    >
      <BelisFeatureCollection featureCollection={featureCollection} fgColor={symbolColor} />
      {/* <DebugFeature feature={focusBoundingBox} /> */}
      <FocusRectangle
        inFocusMode={inFocusMode}
        mapWidth={mapStyle.width}
        mapHeight={mapStyle.height}
      />
      {secondaryInfoVisible && <InfoPanel />}
      {selectedFeature !== undefined && selectedFeature !== null && (
        <InfoBox refRoutedMap={refRoutedMap} />
      )}
      {overlayFeature && (
        <ProjSingleGeoJson
          key={JSON.stringify(overlayFeature)}
          geoJson={overlayFeature}
          masked={true}
          mapRef={refRoutedMap}
        />
      )}
      {gazetteerHit && (
        <GazetteerHitDisplay
          key={"gazHit" + JSON.stringify(gazetteerHit)}
          gazetteerHit={gazetteerHit}
        />
      )}
    </RoutedMap>
  );
};

export default BelisMap;
