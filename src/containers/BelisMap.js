import React, { useEffect, useState } from "react";
import { MappingConstants, RoutedMap } from "react-cismap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import BelisFeatureCollection from "../components/app/FeatureCollection";
import FocusRectangle from "../components/app/FocusRectangle";
import { backgrounds } from "../constants/belis";
import { modifyQueryPart } from "../core/commons/routingHelper";
import { CONNECTIONMODE, getConnectionMode } from "../core/store/slices/app";
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
import {
  getLineIndex,
  getLoadingState,
  getPointIndex,
  initIndex,
} from "../core/store/slices/spatialIndex";
import {
  isSecondaryCacheUsable,
  renewAllSecondaryInfoCache,
} from "../core/store/slices/cacheControl";

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
  const isSecondaryCacheReady = useSelector(isSecondaryCacheUsable);
  const connectionMode = useSelector(getConnectionMode);

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
    dispatch(loadObjects({ boundingBox, inFocusMode, zoom: z, jwt: jwt, force }));
  };
  let symbolColor;
  if (background === "nightplan") {
    symbolColor = "#ffffff";
  } else {
    symbolColor = "#000000";
  }
  useEffect(() => {
    if (connectionMode === CONNECTIONMODE.FROMCACHE) {
      if (loadingState === undefined) {
        dispatch(
          initIndex(() => {
            if (!featureCollection.length) {
              boundingBoxChangedHandler(undefined, true);
            }
          })
        );
      }
    }
  }, [dispatch, connectionMode, loadingState]);

  useEffect(() => {
    dispatch(renewAllSecondaryInfoCache(jwt));
    if (isSecondaryCacheReady === true) {
      boundingBoxChangedHandler(undefined, false);
    }
  }, [dispatch, jwt, isSecondaryCacheReady]);

  // useEffect(() => {
  //   console.log("useEffect BelisMap", {
  //     loadingState,
  //     isSecondaryCacheReady,
  //     connectionMode,
  //   });
  //   if (connectionMode === CONNECTIONMODE.ONLINE) {
  //     if (isSecondaryCacheReady) {
  //       boundingBoxChangedHandler(undefined);
  //     }
  //   } else {
  //     if (loadingState === "done" && lineIndex && pointIndex) {
  //       boundingBoxChangedHandler(undefined, true);
  //     }
  //   }
  //   //this is the initial load
  // }, [loadingState, isSecondaryCacheReady, connectionMode]);

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
      onclick={(e) => {}}
      ondblclick={(e) => {
        try {
          const classesString = e.originalEvent.path[0].getAttribute("class");

          if (classesString) {
            const classes = classesString.split(" ");

            if (classes.includes("leaflet-gl-layer") || classes.includes("leaflet-container")) {
              console.log("unselect feature");

              dispatch(setSelectedFeature(null));
            } else {
              // console.log("classes", classesString);
            }
          }
        } catch (e) {
          console.log("error in dbl click", e);
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
      fallbackPosition={{
        lat: 51.272399,
        lng: 7.199712,
      }}
      fallbackZoom={18}
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
