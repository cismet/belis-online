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
import { getLogin } from "../core/store/slices/auth";
import { getBackground, setBackground } from "../core/store/slices/background";
import {
  isInFocusMode,
  loadObjects,
  setFocusModeActive,
} from "../core/store/slices/featureCollection";
import { isPaleModeActive, setPaleModeActive } from "../core/store/slices/paleMode";

//---------

const BottomNavbar = ({ innerRef, onlineStatus, refRoutedMap, jwt }) => {
  const dispatch = useDispatch();
  const browserlocation = useLocation();

  const inFocusMode = useSelector(isInFocusMode);
  const user = useSelector(getLogin);
  const inPaleMode = useSelector(isPaleModeActive);
  const background = useSelector(getBackground);
  const connectionMode = useSelector(getConnectionMode);
  const uiThreadProgressbar =
    new URLSearchParams(browserlocation.search).get("uiThreadProgressbar") === "true";

  return (
    <Navbar ref={innerRef} bg={background === "nightplan" ? "dark" : "light"} expand='lg'>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Nav className='mr-auto'>
        <div>
          {connectionMode === CONNECTIONMODE.ONLINE && (
            <Icon
              style={{ fontSize: 24, width: "30px", cursor: "pointer" }}
              className='text-primary'
              icon={faUser}
              onClick={() => {
                dispatch(setConnectionMode(CONNECTIONMODE.FROMCACHE));
              }}
            />
          )}
          {connectionMode === CONNECTIONMODE.FROMCACHE && (
            <Icon
              style={{ fontSize: 24, width: "30px", cursor: "pointer" }}
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
              variant={connectionMode === CONNECTIONMODE.ONLINE ? "primary" : "outline-primary"}
              onClick={() => {
                dispatch(setConnectionMode(CONNECTIONMODE.ONLINE));
              }}
            >
              Live-Daten
            </Button>
            <Button
              variant={connectionMode === CONNECTIONMODE.FROMCACHE ? "primary" : "outline-primary"}
              onClick={() => {
                dispatch(setConnectionMode(CONNECTIONMODE.FROMCACHE));
              }}
            >
              lokale Daten
            </Button>
          </ButtonGroup>
        </div>
        <Button
          variant={"outline-primary"}
          style={{ marginLeft: 20 }}
          onClick={() => {
            dispatch(setConnectionMode(CONNECTIONMODE.FROMCACHE));
          }}
        >
          Daten aktualisieren
        </Button>
      </Nav>

      <Nav className='mr-auto'>
        <Switch
          disabled={false}
          id='focus-toggle'
          preLabel='Fokus'
          switched={inFocusMode}
          stateChanged={(switched) => {
            dispatch(setFocusModeActive(switched));
            dispatch(
              loadObjects({
                boundingBox: refRoutedMap.current.getBoundingBox(),
                inFocusMode: switched,
                jwt: jwt,
              })
            );
          }}
        />

        <div style={{ width: 30 }} />
        <Switch
          id='pale-toggle'
          preLabel='Blass'
          switched={inPaleMode}
          stateChanged={(switched) => dispatch(setPaleModeActive(switched))}
        />
      </Nav>

      <Form inline>
        <ButtonGroup className='mr-2' aria-label='First group'>
          <Button
            variant={background === "stadtplan" ? "primary" : "outline-primary"}
            onClick={() => {
              dispatch(setBackground("stadtplan"));
            }}
          >
            Stadtplan
          </Button>
          <Button
            variant={background === "nightplan" ? "primary" : "outline-primary"}
            onClick={() => {
              dispatch(setBackground("nightplan"));
            }}
          >
            Stadtplan dunkel
          </Button>
          <Button
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
              style={{ fontSize: 24, width: "30px", cursor: "pointer" }}
              className='text-primary'
              icon={faWifi}
            />
          ) : (
            <Icon
              style={{ fontSize: 24, width: "30px", cursor: "pointer", color: "#dddddd" }}
              icon={faWifi}
            />
          )}
        </div>
      </Nav>
    </Navbar>
  );
};
export default BottomNavbar;
