import { useWindowSize } from "@react-hook/window-size";
import useComponentSize from "@rehooks/component-size";
import useOnlineStatus from "@rehooks/online-status";
import React, { useRef, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import MapBlocker from "../components/app/MapBlocker";
import { CONNECTIONMODE, getConnectionMode } from "../core/store/slices/app";
import { isDone } from "../core/store/slices/featureCollection";
import BelisMap from "./BelisMap";
import BottomNavbar from "./BottomNavbar";
import TopNavbar from "./TopNavbar";
import SideBar from "./SideBar";
import LoginForm from "../components/app/LoginForm";
import { getJWT } from "../core/store/slices/auth";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { modifyQueryPart } from "../core/commons/routingHelper";
import Menu from "../components/app/menu/Menu";
import UIContextProvider, { UIDispatchContext } from "react-cismap/contexts/UIContextProvider";
import ResponsiveTopicMapContextProvider from "react-cismap/contexts/ResponsiveTopicMapContextProvider";

//---

const View = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [windowWidth, windowHeight] = useWindowSize();
  const onlineStatus = useOnlineStatus();

  let refRoutedMap = useRef(null);
  let refUpperToolbar = useRef(null);
  let sizeU = useComponentSize(refUpperToolbar);
  let refLowerToolbar = useRef(null);
  let sizeL = useComponentSize(refLowerToolbar);
  let refSideBar = useRef(null);
  let sizeSide = useComponentSize(refSideBar);

  const storedJWT = useSelector(getJWT);

  const mapStyle = {
    height: windowHeight - (sizeU.height || 58) - (sizeL.height || 48),
    width: windowWidth - (sizeSide.width || 300),
    cursor: "pointer",
    clear: "both",
  };
  //
  //local state
  const [menuVisible, setMenuVisible] = useState(false);
  const [loginInfo, setLoginInfo] = useState();
  const [jwt, setJwt] = useState(storedJWT);
  const [loggedOut, setLoggedOut] = useState();
  //	let jwt = 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIwIiwic3ViIjoiYWRtaW4iLCJkb21haW4iOiJXVU5EQV9CTEFVIn0.E3eZbW0lp6QrEyaDuGgtKpUqwi7WBp-mChecAej2wqutBcXD6utYCiKeAUMar5kIjgKdiZG5v7R-0uUekeTOp6_MuEysuGL4l-61VKLJwl31Tiw40JIzB3_saVky9bfZ_ntnR6Fkb4FuXe0T1Y2qqKwZd0NI-pCzLb98K6AQn41p7_LunusIxAewXUZm20UtsMhSYDNBLqVqi1GYiv_knNKo1iWnFPT37FuF_Rsx9MkWToHuRFXg1J790ghaJQRH5ky1xNYjiOhdK0k5E4zSZBXI7xnuK0fGdjGnJ2wVkfdGDb65e5H3EP3MEiBX1qRpCDEBstq_bOrKs-MTo464sQ'

  const fcIsDone = useSelector(isDone);
  const connectionMode = useSelector(getConnectionMode);
  const browserlocation = useLocation();

  // useEffect(() => {}, [jwt]);
  const { setAppMenuActiveMenuSection, setAppMenuVisible } = useContext(UIDispatchContext);

  let loginForm = null;

  const showLogin = storedJWT === "" || storedJWT === undefined || storedJWT === null;
  if (showLogin) {
    loginForm = (
      <LoginForm
        key={"login."}
        setJWT={setJwt}
        loginInfo={loginInfo}
        setLoginInfo={setLoginInfo}
        setLoggedOut={setLoggedOut}
      />
    );
  }

  useEffect(() => {
    if (browserlocation.search === "") {
      history.push(
        history.location.pathname + "?lat=51.27185783523219&lng=7.200121618952836&zoom=19"
      );
    }
  }, [history, browserlocation]);

  return (
    <div>
      <Menu
        hide={() => {
          setAppMenuVisible(false);
        }}
        jwt={jwt}
      />

      {showLogin && loginForm}
      <TopNavbar
        innerRef={refUpperToolbar}
        refRoutedMap={refRoutedMap}
        setCacheSettingsVisible={setAppMenuVisible}
        jwt={jwt}
      />
      <SideBar
        innerRef={refSideBar}
        refRoutedMap={refRoutedMap}
        setCacheSettingsVisible={setAppMenuVisible}
        height={mapStyle.height}
      />
      <MapBlocker
        blocking={fcIsDone === false}
        visible={true || connectionMode === CONNECTIONMODE.ONLINE}
        width={windowWidth}
        height={windowHeight}
      />
      <BelisMap
        refRoutedMap={refRoutedMap}
        width={mapStyle.width}
        height={mapStyle.height}
        jwt={jwt}
      />
      <BottomNavbar
        innerRef={refLowerToolbar}
        onlineStatus={onlineStatus}
        refRoutedMap={refRoutedMap}
        jwt={jwt}
      />
    </div>
  );
};

export default View;
