import {
  faBars,
  faBookOpen,
  faCloud,
  faFilter,
  faPowerOff,
  faRedo,
  faSearch,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useWindowSize } from "@react-hook/window-size";
import { Modal, Switch, Tag } from "antd";
import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { MappingConstants } from "react-cismap";
import GazetteerSearchComponent from "react-cismap/GazetteerSearchComponent";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { useLongPress } from "use-long-press";
import Filter from "../components/app/dialogs/Filter";

import MySwitch from "../components/commons/Switch";
import { getArtificialError, showDialog } from "../core/store/slices/app";
import { storeJWT, storeLogin } from "../core/store/slices/auth";
import { getBackground } from "../core/store/slices/background";
import {
  isDone as featureCollectionIsDone,
  forceRefresh,
  getFeatureCollection,
  getFilter,
  getGazetteerHit,
  getOverlayFeature,
  isSearchForbidden,
  loadObjects,
  loadTaskLists,
  MODES,
  setFeatureCollectionForMode,
  setFilter,
  setGazetteerHit,
  setMode,
  setOverlayFeature,
} from "../core/store/slices/featureCollection";
import { getGazData, loadGazeteerEntries } from "../core/store/slices/gazetteerData";
import { fitBoundsForCollection } from "../core/store/slices/map";
import {
  getIntermediateResults,
  getDB as getOfflineActionDB,
} from "../core/store/slices/offlineActionDb";
import {
  isSearchModeActive,
  setActive as setSearchModeActive,
  setWished as setSearchModeWish,
} from "../core/store/slices/search";
import { getTeam } from "../core/store/slices/team";

//---------

const TopNavbar = ({ innerRef, refRoutedMap, setCacheSettingsVisible, jwt }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const searchModeActive = useSelector(isSearchModeActive);
  const selectedTeam = useSelector(getTeam);
  const gazetteerHit = useSelector(getGazetteerHit);
  const overlayFeature = useSelector(getOverlayFeature);
  const fcIsDone = useSelector(featureCollectionIsDone);
  const filterState = useSelector(getFilter);
  const background = useSelector(getBackground);
  const featureCollection = useSelector(getFeatureCollection);
  const searchForbidden = useSelector(isSearchForbidden);
  const offlineActionDB = useSelector(getOfflineActionDB);
  const intermediateResult = useSelector(getIntermediateResults);
  const selectedArbeitsauftrag = useSelector(
    (state) => state.featureCollection.selectedFeature[MODES.TASKLISTS]
  );
  const browserlocation = useLocation();

  const gazData = useSelector(getGazData);
  useEffect(() => {
    dispatch(loadGazeteerEntries());
  }, []);
  const [windowWidth, windowHeight] = useWindowSize();

  let fontSize, narrow, fontSizeIconPixel, iconWidth, toggleSize;
  const isInStandaloneMode = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://");

  if (windowWidth <= 1200) {
    fontSize = "0.8rem";
    narrow = true;
    fontSizeIconPixel = 18;
    iconWidth = "24px";
    toggleSize = "small";
  } else {
    fontSize = "1rem";
    narrow = false;
    fontSizeIconPixel = 24;
    iconWidth = "24px";
    toggleSize = "large";
  }

  const longPress = useLongPress(() => {
    window.location.reload();
  });

  const artificialError = useSelector(getArtificialError);
  if (artificialError) {
    throw new Error("artificialError");
  }

  return (
    <div style={{ fontSize }}>
      <Navbar
        ref={innerRef}
        bg={background === "nightplan" ? "dark" : "light"}
        expand='lg'
        key={"navbar." + fcIsDone}
      >
        <Nav className='mr-auto'>
          <Nav.Link
            disabled={searchForbidden}
            onClick={(e) => {
              dispatch(
                loadObjects({
                  boundingBox: refRoutedMap.current.getBoundingBox(),
                  jwt: jwt,
                  force: true,
                  manualRequest: true,
                })
              );
            }}
            // style={{ cursor: "not-allowed!important" }} works not (should be conditionally done when search forbidden). don't know why
          >
            <Icon className={searchForbidden ? "text" : "text-primary"} icon={faSearch} />
          </Nav.Link>
          <Nav.Link>
            <Switch
              disabled={searchForbidden}
              checked={searchModeActive}
              checkedChildren='automatische Suche'
              unCheckedChildren='automatische Suche'
              onChange={(switched) => {
                dispatch(setSearchModeActive(switched));
                if (switched === true) {
                  dispatch(setSearchModeWish(true));
                  dispatch(
                    loadObjects({
                      boundingBox: refRoutedMap.current.getBoundingBox(),
                      jwt: jwt,
                    })
                  );
                } else {
                  dispatch(setSearchModeWish(false));
                }
              }}
            />
          </Nav.Link>

          <Nav.Link
            onClick={(e) => {
              const filterDialog = (
                <Filter refRoutedMap={refRoutedMap} filterStateFromRedux={filterState} />
              );
              dispatch(showDialog(filterDialog));
            }}
            style={{ marginRight: 20, marginLeft: 20 }}
          >
            <Icon className='text-primary' icon={faFilter} /> Filter (
            {Object.entries(filterState).reduce((prev, curr) => {
              if (curr[1]?.enabled) {
                return prev + 1;
              } else {
                return prev;
              }
            }, 0)}
            /{Object.entries(filterState).length})
          </Nav.Link>

          <Nav.Link
            onClick={(e) => {
              if (e.ctrlKey || e.altKey || e.shiftKey || isInStandaloneMode()) {
                window.location.reload();
              } else {
                dispatch(forceRefresh());
              }
            }}
          >
            <Icon className='text-primary' icon={faRedo} />
          </Nav.Link>
        </Nav>

        <Nav className='mr-auto text-primary'>
          {selectedArbeitsauftrag
            ? selectedArbeitsauftrag.properties.nummer
            : "Kein Arbeitsauftrag ausgewählt"}{" "}
          ({selectedTeam.name})
        </Nav>

        {process.env.NODE_ENV !== "production" && (
          <Nav.Link
            onClick={() => {
              //localforage.clear();
              // console.log(
              //   "refRoutedMap",
              //   refRoutedMap?.current?.leafletMap?.leafletElement.getPanes()[
              //     "backgroundvectorLayers"
              //   ].style.opacity
              // );
              // dispatch(setArtificialError(true));

              console.log("xxx intermediateResult ", intermediateResult);
            }}
          >
            <Icon icon={faVial} />
          </Nav.Link>
        )}
        <Nav.Link
          onClick={() => {
            dispatch(
              loadTaskLists({
                team: selectedTeam,
                jwt,
                done: () => {
                  setTimeout(() => {
                    dispatch(setMode(MODES.TASKLISTS));
                    dispatch(fitBoundsForCollection());
                    dispatch(setFeatureCollectionForMode(MODES.PROTOCOLS));
                  }, 400);
                },
              })
            );
          }}
        >
          <Icon icon={faBookOpen} />
        </Nav.Link>
        <span
          className={narrow ? "reducedSizeInputComponnet" : undefined}
          style={{ marginRight: 10 }}
        >
          <GazetteerSearchComponent
            mapRef={refRoutedMap}
            gazetteerHit={gazetteerHit}
            setGazetteerHit={(hit) => {
              dispatch(setGazetteerHit(hit));
            }}
            overlayFeature={overlayFeature}
            setOverlayFeature={(feature) => {
              dispatch(setOverlayFeature(feature));
            }}
            gazData={gazData}
            pixelwidth={narrow ? 250 : 350}
            dropup={false}
            enabled={gazData.length > 0}
            referenceSystem={MappingConstants.crs3857}
            referenceSystemDefinition={MappingConstants.proj4crs3857def}
            autoFocus={false}
            tooltipPlacement='top'
          />
        </span>

        <Nav.Link
          style={{ marginLeft: 10, marginRight: 10, color: "#377CF6" }}
          size={narrow ? "sm" : ""}
          id='navitem_logout'
          eventKey={3}
          onClick={() => {
            // dispatch(storeLogin(undefined));
            // dispatch(storeJWT(undefined));
            history.push("/" + browserlocation.search);
          }}
        >
          <Icon icon={faPowerOff} />
        </Nav.Link>

        <Button
          size={narrow ? "sm" : ""}
          onClick={() => {
            setCacheSettingsVisible(true);
          }}
          variant='outline-primary'
        >
          <Icon icon={faBars} />
        </Button>
      </Navbar>
    </div>
  );
};

export default TopNavbar;
