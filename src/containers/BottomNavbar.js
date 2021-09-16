import { faMixcloud } from "@fortawesome/free-brands-svg-icons";
import { faDatabase, faUser, faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ProgressBar from "react-bootstrap/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Switch from "../components/commons/Switch";
import { CONNECTIONMODE, getConnectionMode, setConnectionMode } from "../core/store/slices/app";
import { getLogin, getLoginFromJWT } from "../core/store/slices/auth";
import { getBackground, setBackground } from "../core/store/slices/background";
import {
  getCacheDate,
  getCacheUpdatingProgress,
  getCacheUser,
  isCacheFullUsable,
  renewAllPrimaryInfoCache,
  renewAllSecondaryInfoCache,
} from "../core/store/slices/cacheControl";
import {
  isInFocusMode,
  loadObjects,
  setFocusModeActive,
} from "../core/store/slices/featureCollection";
import { isPaleModeActive, setPaleModeActive } from "../core/store/slices/paleMode";
import { useWindowSize } from "@react-hook/window-size";

//---------

const BottomNavbar = ({ innerRef, onlineStatus, refRoutedMap, jwt }) => {
  const dispatch = useDispatch();
  const browserlocation = useLocation();
  const [windowWidth, windowHeight] = useWindowSize();

  const inFocusMode = useSelector(isInFocusMode);
  const cacheDate = useSelector(getCacheDate);
  const cacheUser = useSelector(getCacheUser);
  const inPaleMode = useSelector(isPaleModeActive);
  const background = useSelector(getBackground);
  const connectionMode = useSelector(getConnectionMode);
  const cachingProgress = useSelector(getCacheUpdatingProgress);
  const isCacheReady = useSelector(isCacheFullUsable);
  const uiThreadProgressbar =
    new URLSearchParams(browserlocation.search).get("uiThreadProgressbar") === "true";
  let user;

  if (connectionMode === CONNECTIONMODE.FROMCACHE) {
    user = cacheUser;
  } else {
    user = getLoginFromJWT(jwt);
  }
  let fontSize, narrow, fontSizeIconPixel, iconWidth, toggleSize;

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

  return (
    <div style={{ fontSize }}>
      <Navbar ref={innerRef} bg={background === "nightplan" ? "dark" : "light"} expand='lg'>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Nav className='mr-auto'>
          <div>
            {connectionMode === CONNECTIONMODE.ONLINE && (
              <Icon
                style={{
                  fontSize: fontSizeIconPixel,
                  width: iconWidth,
                  cursor: "pointer",
                }}
                className='text-primary'
                icon={faUser}
                onClick={() => {
                  dispatch(setConnectionMode(CONNECTIONMODE.FROMCACHE));
                }}
              />
            )}
            {connectionMode === CONNECTIONMODE.FROMCACHE && (
              <Icon
                style={{
                  fontSize: fontSizeIconPixel,
                  width: iconWidth,
                  cursor: "pointer",
                }}
                className='text-primary'
                icon={faDatabase}
                onClick={() => {
                  dispatch(setConnectionMode(CONNECTIONMODE.ONLINE));
                }}
              />
            )}
            {user && <span style={{ marginLeft: 10 }}>{user}</span>}
          </div>
          <div style={{ marginLeft: 10 }}>
            <ButtonGroup className='mr-2' aria-label='ModusGroup'>
              <Button
                style={{ fontSize }}
                variant={connectionMode === CONNECTIONMODE.ONLINE ? "primary" : "outline-primary"}
                onClick={() => {
                  dispatch(setConnectionMode(CONNECTIONMODE.ONLINE));
                }}
              >
                Live-Daten
              </Button>
              <Button
                style={{ fontSize }}
                disabled={isCacheReady === false}
                variant={
                  connectionMode === CONNECTIONMODE.FROMCACHE ? "primary" : "outline-primary"
                }
                onClick={() => {
                  dispatch(setConnectionMode(CONNECTIONMODE.FROMCACHE));
                }}
              >
                <span>
                  lokale Daten{" "}
                  {cacheDate !== -1 && (
                    <span>
                      (
                      {isToday(cacheDate)
                        ? new Date(cacheDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : new Date(cacheDate).toLocaleDateString()}
                      )
                    </span>
                  )}
                </span>
              </Button>
            </ButtonGroup>
          </div>
          {cachingProgress >= 1 && (
            <Button
              variant={"outline-primary"}
              style={{ marginLeft: 20, fontSize }}
              onClick={() => {
                dispatch(renewAllSecondaryInfoCache(jwt));
                dispatch(renewAllPrimaryInfoCache(jwt));
              }}
            >
              Daten aktualisieren
            </Button>
          )}
          {cachingProgress < 1 && (
            <ProgressBar
              style={{
                marginLeft: 29,
                minHeight: 31.5,
                minWidth: 141,
                fontSize: 14,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#377CF6",
              }}
              animated
              now={cachingProgress * 100 + 10}
              max={110}
            />
          )}
        </Nav>

        <Nav className='mr-auto'>
          <Switch
            id='focus-toggle'
            preLabel='Fokus'
            switched={inFocusMode}
            size={toggleSize}
            stateChanged={(switched) => {
              dispatch(setFocusModeActive(switched));
              setTimeout(() => {
                dispatch(
                  loadObjects({
                    boundingBox: refRoutedMap.current.getBoundingBox(),
                    inFocusMode: switched,
                    jwt: jwt,
                  })
                );
              }, 300);
            }}
          />
          <div style={{ width: 10 }} />
          <Switch
            id='pale-toggle'
            preLabel='Blass'
            switched={inPaleMode}
            stateChanged={(switched) => dispatch(setPaleModeActive(switched))}
            size={toggleSize}
          />
        </Nav>

        <Form inline>
          <ButtonGroup className='mr-2' aria-label='First group'>
            <Button
              style={{ fontSize }}
              variant={background === "stadtplan" ? "primary" : "outline-primary"}
              onClick={() => {
                dispatch(setBackground("stadtplan"));
              }}
            >
              Stadtplan
            </Button>
            <Button
              style={{ fontSize }}
              variant={background === "nightplan" ? "primary" : "outline-primary"}
              onClick={() => {
                dispatch(setBackground("nightplan"));
              }}
            >
              Stadtplan dunkel
            </Button>
            <Button
              style={{ fontSize }}
              variant={background === "lbk" ? "primary" : "outline-primary"}
              onClick={() => {
                dispatch(setBackground("lbk"));
              }}
            >
              Luftbildkarte
            </Button>
          </ButtonGroup>
        </Form>
        {uiThreadProgressbar === true && (
          <Nav>
            <ProgressBar style={{ width: 200 }} animated now={100} max={100} />
          </Nav>
        )}
        <Nav>
          <div>
            {onlineStatus ? (
              <Icon
                style={{
                  fontSize: fontSizeIconPixel,
                  width: iconWidth,
                  cursor: "pointer",
                }}
                className='text-primary'
                icon={faWifi}
              />
            ) : (
              <Icon
                style={{
                  fontSize: fontSizeIconPixel,
                  width: iconWidth,
                  cursor: "pointer",
                  color: "#dddddd",
                }}
                icon={faWifi}
              />
            )}
          </div>
        </Nav>
      </Navbar>
    </div>
  );
};
export default BottomNavbar;
const isToday = (someDateMS) => {
  const someDate = new Date(someDateMS);
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};
