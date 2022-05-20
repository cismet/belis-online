import React, { useEffect, useRef, useState } from "react";
import { MappingConstants, RoutedMap } from "react-cismap";
import { DivOverlay } from "react-leaflet";
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
  getFeatureCollectionMode,
  MODES,
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
import L from "leaflet";
import LightBoxContextProvider, {
  LightBoxDispatchContext,
} from "react-cismap/contexts/LightBoxContextProvider";
import { useContext } from "react";
import { convertBounds2BBox } from "../core/helper/gisHelper";
import { setBounds } from "../core/store/slices/mapInfo";
import {
  TopicMapStylingContext,
  TopicMapStylingDispatchContext,
} from "react-cismap/contexts/TopicMapStylingContextProvider";

//---

const BelisMap = ({ refRoutedMap, width, height, jwt }) => {
  const dispatch = useDispatch();
  const mapRef = refRoutedMap?.current?.leafletMap?.leafletElement;
  const blockingTime = 1000;
  const [blockLoading, setBlockLoading] = useState(false);
  const [indexInitialized, setIndexInitialized] = useState(false);
  const [indexInitializationRequested, setIndexInitializationRequested] = useState(false);
  const { setSelectedBackground } = useContext(TopicMapStylingDispatchContext);

  const {
    backgroundModes,
    selectedBackground,
    baseLayerConf,
    backgroundConfigurations,
    additionalLayerConfiguration,
    activeAdditionalLayerKeys,
  } = useContext(TopicMapStylingContext);

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

  const [mapBoundsAndSize, setMapBoundsAndSize] = useState();

  const boundsFromMapRef = mapRef?.getBounds() || null;
  const sizeFromMapRef = mapRef?.getSize() || null;
  console.log("yyy leaflet", L);

  useEffect(() => {
    setMapBoundsAndSize((old) => {
      const mapBounds = mapRef?.getBounds();
      const mapSize = mapRef?.getSize();
      if (
        old === undefined ||
        JSON.stringify(old.mapBounds) !== JSON.stringify(mapBounds) ||
        JSON.stringify(old.mapSize) !== JSON.stringify(mapSize)
      ) {
        old = {
          mapBounds,
          mapSize,
        };
        dispatch(setBounds(mapBounds));
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
  const featureCollectionMode = useSelector(getFeatureCollectionMode);
  const overlayFeature = useSelector(getOverlayFeature);
  const gazetteerHit = useSelector(getGazetteerHit);
  const loadingState = useSelector(getLoadingState);

  const connectionMode = useSelector(getConnectionMode);
  const history = useHistory();
  const browserlocation = useLocation();

  const zoom = useSelector(getZoom);

  const inPaleMode = useSelector(isPaleModeActive);
  const background = useSelector(getBackground);

  const urlSearchParams = new URLSearchParams(browserlocation.search);

  let backgroundsFromMode;
  try {
    backgroundsFromMode = backgroundConfigurations[selectedBackground].layerkey;
  } catch (e) {}

  const _backgroundLayers = backgroundsFromMode || "rvrGrau@40";

  useEffect(() => {
    // const key = (inPaleMode === true ? "pale_" : "") + background;
    const key = background;
    if (selectedBackground !== backgrounds[key]) {
      setSelectedBackground(backgrounds[key]);
    }
  }, [inPaleMode, background, selectedBackground, setSelectedBackground, dispatch]);

  const { mapSize, mapBounds } = mapBoundsAndSize || {};

  //                 __              _ _
  //   __ _  ___    / _| ___  _ __  (_) |_
  //  / _` |/ _ \  | |_ / _ \| '__| | | __|
  // | (_| | (_) | |  _| (_) | |    | | |_
  //  \__, |\___/  |_|  \___/|_|    |_|\__|
  //  |___/
  useEffect(() => {
    // console.log("xxx go for it", {
    //   mapBounds,
    //   mapSize,
    //   blockLoading,
    //   indexInitialized,
    //   connectionMode,
    // });

    if (
      blockLoading === false &&
      (indexInitialized || connectionMode !== CONNECTIONMODE.FROMCACHE)
    ) {
      if (mapBounds && mapSize) {
        const boundingBox = convertBounds2BBox(mapBounds);

        const z = urlSearchParams.get("zoom");
        if (zoom !== z) {
          dispatch(setZoom(z));
        }
        if (featureCollectionMode === MODES.OBJECTS) {
          dispatch(loadObjects({ boundingBox, inFocusMode, zoom: z, jwt: jwt, force: false }));
          // console.log("xxx loadObjects", {
          //   mapBounds,
          //   mapSize,
          //   blockLoading,
          //   indexInitialized,
          //   connectionMode,
          // });
        } else {
          // console.log("xxx no map for you (mapBounds && mapSize)", mapBounds, mapSize);
        }
      }
    } else {
      // console.log(
      //   "xxx no map for you (blockLoading===false,indexInitialized,isSecondaryCacheReady)",
      //   blockLoading === false,
      //   indexInitialized,
      //   isSecondaryCacheReady
      // );
    }
  }, [mapBounds, mapSize, blockLoading, indexInitialized, connectionMode, featureCollectionMode]);

  // initalize the index in CACHEMODE when the loadingstate is undefined
  useEffect(() => {
    // console.log("should i initialize index?");

    if (connectionMode === CONNECTIONMODE.FROMCACHE) {
      // console.log("should i initialize index in CONNECTIONMODE.FROMCACHE");

      if (loadingState === undefined || indexInitialized === false) {
        // console.log("should i initialize index in CONNECTIONMODE.FROMCACHE: yes will do");
        if (indexInitializationRequested === false) {
          setIndexInitializationRequested(true);
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
        }
      } else {
        // console.log(
        //   "should i initialize index in CONNECTIONMODE.FROMCACHE: no will not",
        //   loadingState
        // );
      }
    }
  }, [dispatch, connectionMode, loadingState]);

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
      key={"leafletRoutedMap"}
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
      backgroundlayers={_backgroundLayers}
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
      boundingBoxChangedHandler={(boundingBox) => {
        // console.log("xxx boundingBox Changed", boundingBox);
      }}
    >
      <BelisFeatureCollection
        style={{ zIndex: 600 }}
        featureCollection={featureCollection}
        fgColor={symbolColor}
      ></BelisFeatureCollection>
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
      {inPaleMode && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 401,
            width: mapStyle.width,
            height: mapStyle.height,
            opacity: 0.5,
            background: "#ffffff",
            mrgin: 10,
          }}
        />
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
