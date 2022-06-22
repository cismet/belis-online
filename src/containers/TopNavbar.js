import React, { useEffect } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLongPress } from "use-long-press";

import {
  faBars,
  faBookOpen,
  faCertificate,
  faGlobeEurope,
  faLock,
  faLockOpen,
  faPowerOff,
  faRedo,
  faSpinner,
  faTimes,
  faVial,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";

import Switch from "../components/commons/Switch";

import {
  setFilter,
  loadObjects,
  isDone as featureCollectionIsDone,
  getFilter,
  getFeatureCollection,
  isSearchForbidden,
  setGazetteerHit,
  getGazetteerHit,
  setOverlayFeature,
  getOverlayFeature,
  forceRefresh,
  loadTaskLists,
  MODES,
  setMode,
  setFeatureCollectionForMode,
} from "../core/store/slices/featureCollection";

import { getGazData, loadGazeteerEntries } from "../core/store/slices/gazetteerData";
import { getTeam } from "../core/store/slices/team";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  setActive as setSearchModeActive,
  setWished as setSearchModeWish,
  isSearchModeActive,
} from "../core/store/slices/search";
import { getBackground } from "../core/store/slices/background";
import GazetteerSearchComponent from "react-cismap/GazetteerSearchComponent";
import { MappingConstants } from "react-cismap";
import { REST_SERVICE } from "../constants/belis";
import {
  getCacheDate,
  renewAllPrimaryInfoCache,
  renewAllSecondaryInfoCache,
} from "../core/store/slices/cacheControl";
import { getLoginFromJWT, storeJWT, storeLogin } from "../core/store/slices/auth";
import { useWindowSize } from "@react-hook/window-size";
import {
  getDB as getOfflineActionDB,
  storeIntermediateResults,
} from "../core/store/slices/offlineActionDb";
import { NavItem } from "react-bootstrap";
import { fetchGraphQL } from "../core/commons/graphql";
import queries from "../core/queries/online";
import { fitBoundsForCollection } from "../core/store/slices/map";
import localforage from "localforage";
import store from "../core/store";
import { getArtificialError, setArtificialError } from "../core/store/slices/app";
//---------

const TopNavbar = ({ innerRef, refRoutedMap, setCacheSettingsVisible, jwt }) => {
  const dispatch = useDispatch();
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
  const selectedArbeitsauftrag = useSelector(
    (state) => state.featureCollection.selectedFeature[MODES.TASKLISTS]
  );

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
          {/* <Nav.Link>
            <div
              // onClick={() => {
              // 	window.location.reload();
              // }}
              style={{
                width: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor_: "red",
                height: "100%",
              }}
              key={"navbar.div." + fcIsDone}
            >
              {fcIsDone === false && searchModeActive === true && (
                <Icon className='text-primary' spin icon={faSpinner} />
                // <span>-.-</span>
              )}
              {fcIsDone === true && <div style={{ fontSize: 9 }}>{featureCollection.length}</div>}
            </div>
          </Nav.Link> */}
          <Nav.Link>
            <Switch
              disabled={searchForbidden}
              id='search-mode-toggle'
              key={"search-mode-toggle" + searchModeActive}
              preLabel='Suche'
              switched={searchModeActive}
              stateChanged={(switched) => {
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
          <NavDropdown
            style={{ zIndex: 10000 }}
            className='text-primary'
            title='nach'
            id='basic-nav-dropdown'
            rootCloseEvent='jj'
          >
            {Object.keys(filterState).map((key) => {
              const item = filterState[key];
              return (
                <NavDropdown.Item key={key + "NavDropdown.Item-key"} style={{ width: 300 }}>
                  <Switch
                    id={item.key + "toggle-id"}
                    key={item.key + "toggle"}
                    preLabel={item.title}
                    switched={item.enabled}
                    toggleStyle={{ float: "right" }}
                    stateChanged={(switched) => {
                      const _fs = JSON.parse(JSON.stringify(filterState));
                      _fs[key].enabled = switched;
                      dispatch(setFilter(_fs));

                      setTimeout(() => {
                        dispatch(
                          loadObjects({
                            boundingBox: refRoutedMap.current.getBoundingBox(),
                            overridingFilterState: _fs,
                            jwt: jwt,
                          })
                        );
                      }, 50);
                    }}
                  />
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
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
              console.log(
                "refRoutedMap",
                refRoutedMap?.current?.leafletMap?.leafletElement.getPanes()[
                  "backgroundvectorLayers"
                ].style.opacity
              );
              //dispatch(setArtificialError(true));
              dispatch(storeIntermediateResults({}));
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
          />
        </span>

        <Nav.Link
          style={{ marginLeft: 10, marginRight: 10, color: "#377CF6" }}
          size={narrow ? "sm" : ""}
          id='navitem_logout'
          eventKey={3}
          onClick={() => {
            dispatch(storeLogin(undefined));
            dispatch(storeJWT(undefined));
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
