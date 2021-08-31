import React, { useEffect } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { faBars, faBookOpen, faGlobeEurope, faTimes } from "@fortawesome/free-solid-svg-icons";
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
} from "../core/store/slices/featureCollection";

import { getGazData, loadGazeteerEntries } from "../core/store/slices/gazetteerData";

import { useDispatch, useSelector } from "react-redux";
import {
  setActive as setSearchModeActive,
  setWished as setSearchModeWish,
  isSearchModeActive,
} from "../core/store/slices/search";
import { getBackground } from "../core/store/slices/background";
import GazetteerSearchComponent from "react-cismap/GazetteerSearchComponent";
import { MappingConstants } from "react-cismap";
//---------

const TopNavbar = ({ innerRef, refRoutedMap, setCacheSettingsVisible, jwt }) => {
  const dispatch = useDispatch();
  const searchModeActive = useSelector(isSearchModeActive);
  const gazetteerHit = useSelector(getGazetteerHit);
  const overlayFeature = useSelector(getOverlayFeature);
  const fcIsDone = useSelector(featureCollectionIsDone);
  const filterState = useSelector(getFilter);
  const background = useSelector(getBackground);
  const featureCollection = useSelector(getFeatureCollection);
  const searchForbidden = useSelector(isSearchForbidden);
  const gazData = useSelector(getGazData);
  useEffect(() => {
    dispatch(loadGazeteerEntries());
  }, []);

  return (
    <Navbar
      ref={innerRef}
      bg={background === "nightplan" ? "dark" : "light"}
      expand='lg'
      key={"navbar." + fcIsDone}
    >
      <Nav className='mr-auto'>
        <Nav.Link>
          <div
            // onClick={() => {
            // 	window.location.reload();
            // }}
            style={{ width: 20 }}
            key={"navbar.div." + fcIsDone}
          >
            {fcIsDone === false && searchModeActive === true && (
              // <Icon className='text-primary' spin icon={faSpinner} />
              <span>-.-</span>
            )}
            {fcIsDone === true && (
              <div style={{ fontSize: 9, marginTop: 7 }}>{featureCollection.length}</div>
            )}
          </div>
        </Nav.Link>
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
        <Nav.Link href='#home'>
          <Icon className='text-primary' icon={faGlobeEurope} />
        </Nav.Link>
      </Nav>

      <Nav className='mr-auto text-primary'>Kein Arbeitsauftrag ausgewählt (Erneuerung)</Nav>
      <Nav.Link href='#home'>
        <Icon icon={faBookOpen} />
      </Nav.Link>
      <Form style={{ marginRight: 10 }}>
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
          pixelwidth={350}
          dropup={false}
          enabled={gazData.length > 0}
          referenceSystem={MappingConstants.crs3857}
          referenceSystemDefinition={MappingConstants.proj4crs3857def}
        />
      </Form>

      <Button
        onClick={() => {
          setCacheSettingsVisible(true);
        }}
        variant='outline-primary'
      >
        <Icon icon={faBars} />
      </Button>
    </Navbar>
  );
};

export default TopNavbar;
