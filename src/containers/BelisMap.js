import React, { useEffect, useRef, useState } from "react";
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
import LightBoxContextProvider, {
  LightBoxDispatchContext,
} from "react-cismap/contexts/LightBoxContextProvider";
import { useContext } from "react";
import { convertBounds2BBox } from "../core/helper/gisHelper";

//---

const BelisMap = ({ refRoutedMap, width, height, jwt }) => {
  const dispatch = useDispatch();
  const mapRef = refRoutedMap?.current?.leafletMap?.leafletElement;
  const blockingTime = 1000;
  const [blockLoading, setBlockLoading] = useState(false);
  const [indexInitialized, setIndexInitialized] = useState(false);

  const timeoutHandlerRef = useRef(null);

  useEffect(() => {
    if (mapRef) {
      if (mapRef.attributionControl) {
        mapRef.attributionControl.setPrefix("");
      }
      mapRef.on("movestart", () => {
        setBlockLoading(true);
      });
      mapRef.on("moveend", () => {
        setBlockLoading(true);
        window.clearTimeout(timeoutHandlerRef.current);
        timeoutHandlerRef.current = window.setTimeout(() => {
          setBlockLoading(false);
        }, blockingTime);
      });
      mapRef.on("zoomstart", () => {
        setBlockLoading(true);
      });
      mapRef.on("zoomend", () => {
        setBlockLoading(true);
        window.clearTimeout(timeoutHandlerRef.current);
        timeoutHandlerRef.current = window.setTimeout(() => {
          setBlockLoading(false);
        }, blockingTime);
      });
    }
  }, [mapRef]);

  const [mapBounds, setMapBounds] = useState();
  const [mapSize, setMapSize] = useState();

  const mapBoundsRef = useRef();
  useEffect(() => {
    mapBoundsRef.current = mapBounds;
  }, [mapBounds]);

  // console.log("refRoutedMap", refRoutedMap);

  const boundsFromMapRef = mapRef?.getBounds() || null;
  const sizeFromMapRef = mapRef?.getSize() || null;

  useEffect(() => {
    setMapSize((old) => {
      if (JSON.stringify(old) !== JSON.stringify(mapRef?.getSize())) {
        old = mapRef?.getSize();
      }
      return old;
    });
    setMapBounds((old) => {
      if (JSON.stringify(old) !== JSON.stringify(mapRef?.getBounds())) {
        old = mapRef?.getBounds();
      }
      return old;
    });
  }, [mapRef, sizeFromMapRef, boundsFromMapRef]);

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

  //                 __              _ _
  //   __ _  ___    / _| ___  _ __  (_) |_
  //  / _` |/ _ \  | |_ / _ \| '__| | | __|
  // | (_| | (_) | |  _| (_) | |    | | |_
  //  \__, |\___/  |_|  \___/|_|    |_|\__|
  //  |___/
  useEffect(() => {
    if (
      blockLoading === false &&
      isSecondaryCacheReady &&
      (indexInitialized || connectionMode !== CONNECTIONMODE.FROMCACHE)
    ) {
      if (mapBounds && mapSize) {
        const _boundingBox = refRoutedMap.current.getBoundingBox();
        const boundingBox = convertBounds2BBox(mapBounds);

        const z = urlSearchParams.get("zoom");
        if (zoom !== z) {
          dispatch(setZoom(z));
        }
        dispatch(loadObjects({ boundingBox, inFocusMode, zoom: z, jwt: jwt, force: false }));
      } else {
        // console.log("xxx no map for you (mapBounds && mapSize)", mapBounds, mapSize);
      }
    } else {
      // console.log(
      //   "xxx no map for you (blockLoading===false,indexInitialized,isSecondaryCacheReady)",
      //   blockLoading === false,
      //   indexInitialized,
      //   isSecondaryCacheReady
      // );
    }
  }, [mapBounds, mapSize, blockLoading, indexInitialized, isSecondaryCacheReady, connectionMode]);

  // initalize the index in CACHEMODE when the loadingstate is undefined
  useEffect(() => {
    // console.log("should i initialize index?");

    if (connectionMode === CONNECTIONMODE.FROMCACHE) {
      // console.log("should i initialize index in CONNECTIONMODE.FROMCACHE");

      if (loadingState === undefined || indexInitialized === false) {
        // console.log("should i initialize index in CONNECTIONMODE.FROMCACHE: yes will do");

        dispatch(
          initIndex(() => {
            console.log(
              "featureCollection.length",
              featureCollection.length,
              !featureCollection.length
            );
            setIndexInitialized(true);
          })
        );
      } else {
        // console.log(
        //   "should i initialize index in CONNECTIONMODE.FROMCACHE: no will not",
        //   loadingState
        // );
      }
    }
  }, [dispatch, connectionMode, loadingState]);

  // renew the secondary cache when user changed or on first load
  useEffect(() => {
    dispatch(renewAllSecondaryInfoCache(jwt));
  }, [dispatch, jwt]);

  //Symbolcolors from nightmode
  let symbolColor;
  if (background === "nightplan") {
    symbolColor = "#ffffff";
  } else {
    symbolColor = "#000000";
  }

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
