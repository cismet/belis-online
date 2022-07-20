import { useWindowSize } from "@react-hook/window-size";
import useComponentSize from "@rehooks/component-size";
import useOnlineStatus from "@rehooks/online-status";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UIDispatchContext } from "react-cismap/contexts/UIContextProvider";
import PhotoLightBox from "react-cismap/topicmaps/PhotoLightbox";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";

import LoginForm from "../components/app/LoginForm";
import MapBlocker from "../components/app/MapBlocker";
import Menu from "../components/app/menu/Menu";
import { CONNECTIONMODE, getConnectionMode, getDialog } from "../core/store/slices/app";
import { getJWT } from "../core/store/slices/auth";
import { storeJWT } from "../core/store/slices/auth";
import { renewCache } from "../core/store/slices/cacheControl";
import { getWorker } from "../core/store/slices/dexie";
import {
  getFeatureCollectionMode,
  getSelectedFeature,
  isDone,
  loadTaskLists,
  MODES,
  setDone,
} from "../core/store/slices/featureCollection";
import { tasklistPostSelection } from "../core/store/slices/featureCollectionSubslices/tasklists";
import {
  fillLeuchtentypenFromDexie,
  fillLeuchtmittelFromDexie,
  fillRundsteuerempfaengerFromDexie,
  fillTeamsFromDexie,
} from "../core/store/slices/keytables";
import { initialize, resyncDb } from "../core/store/slices/offlineActionDb";
import { getTeam } from "../core/store/slices/team";
import BelisMap from "./BelisMap";
import BottomNavbar from "./BottomNavbar";
import SideBar from "./SideBar";
import TopNavbar from "./TopNavbar";

//---

const View = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [windowWidth, windowHeight] = useWindowSize();
  const onlineStatus = useOnlineStatus();
  const dexieW = useSelector(getWorker);
  const jwt = useSelector(getJWT);

  let refRoutedMap = useRef(null);
  let refApp = useRef(null);
  let refUpperToolbar = useRef(null);
  let sizeU = useComponentSize(refUpperToolbar);
  let refLowerToolbar = useRef(null);
  let sizeL = useComponentSize(refLowerToolbar);
  let refSideBar = useRef(null);
  let sizeSide = useComponentSize(refSideBar);
  const selectedTeam = useSelector(getTeam);

  const storedJWT = useSelector(getJWT);

  const mapStyle = {
    height: windowHeight - (sizeU.height || 58) - (sizeL.height || 48),
    width: windowWidth - (sizeSide.width || 300),
    cursor: "pointer",
    clear: "both",
  };
  //
  //local state
  const [loginInfo, setLoginInfo] = useState();

  const [loggedOut, setLoggedOut] = useState();
  //	let jwt = 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiIwIiwic3ViIjoiYWRtaW4iLCJkb21haW4iOiJXVU5EQV9CTEFVIn0.E3eZbW0lp6QrEyaDuGgtKpUqwi7WBp-mChecAej2wqutBcXD6utYCiKeAUMar5kIjgKdiZG5v7R-0uUekeTOp6_MuEysuGL4l-61VKLJwl31Tiw40JIzB3_saVky9bfZ_ntnR6Fkb4FuXe0T1Y2qqKwZd0NI-pCzLb98K6AQn41p7_LunusIxAewXUZm20UtsMhSYDNBLqVqi1GYiv_knNKo1iWnFPT37FuF_Rsx9MkWToHuRFXg1J790ghaJQRH5ky1xNYjiOhdK0k5E4zSZBXI7xnuK0fGdjGnJ2wVkfdGDb65e5H3EP3MEiBX1qRpCDEBstq_bOrKs-MTo464sQ'

  const fcIsDone = useSelector(isDone);
  const fcIsDoneRef = useRef(fcIsDone);

  const appDialog = useSelector(getDialog);

  const connectionMode = useSelector(getConnectionMode);
  const browserlocation = useLocation();
  useEffect(() => {
    fcIsDoneRef.current = fcIsDone;
  }, [fcIsDone]);
  useEffect(() => {
    if (refApp?.current) {
      const appRef = refApp.current;
      const blockingHandler = (e) => {
        if (fcIsDoneRef.current === false) {
          e.preventDefault();
        }
      };
      appRef.addEventListener("touchmove", blockingHandler);
      return () => {
        appRef.removeEventListener("touchmove", blockingHandler);
      };
    }
  }, [refApp]);

  useEffect(() => {
    //async block
    (async () => {
      if (jwt && dexieW) {
        try {
          //Teams
          const teams = await dexieW.getAll("team");
          if (!teams || teams.length === 0) {
            dispatch(
              renewCache("team", jwt, undefined, () => {
                dispatch(fillTeamsFromDexie());
              })
            );
          } else {
            dispatch(fillTeamsFromDexie());
          }

          //tkey_leuchtentyp
          const tkey_leuchtentyp = await dexieW.getAll("tkey_leuchtentyp");
          if (!tkey_leuchtentyp || tkey_leuchtentyp.length === 0) {
            dispatch(
              renewCache("tkey_leuchtentyp", jwt, undefined, () => {
                dispatch(fillLeuchtentypenFromDexie());
              })
            );
          } else {
            dispatch(fillLeuchtentypenFromDexie());
          }
          //rundsteuerempfaenger
          const rundsteuerempfaenger = await dexieW.getAll("rundsteuerempfaenger");
          if (!rundsteuerempfaenger || rundsteuerempfaenger.length === 0) {
            dispatch(
              renewCache("rundsteuerempfaenger", jwt, undefined, () => {
                dispatch(fillRundsteuerempfaengerFromDexie());
              })
            );
          } else {
            dispatch(fillRundsteuerempfaengerFromDexie());
          }

          //leuchtmittel
          const leuchtmittel = await dexieW.getAll("leuchtmittel");
          if (!leuchtmittel || leuchtmittel.length === 0) {
            dispatch(
              renewCache("leuchtmittel", jwt, undefined, () => {
                dispatch(fillLeuchtmittelFromDexie());
              })
            );
          } else {
            dispatch(fillLeuchtmittelFromDexie());
          }
        } catch (e) {
          console.log("Error in fetching needed data from dexie", e);
        }
      }
    })();
  }, [jwt, dexieW, dispatch]);
  //Selection management
  const featureCollectionMode = useSelector(getFeatureCollectionMode);
  const selectedFeature = useSelector(getSelectedFeature);

  useEffect(() => {
    if (featureCollectionMode === MODES.TASKLISTS && selectedFeature) {
      dispatch(tasklistPostSelection(selectedFeature, storedJWT));
    }
  }, [featureCollectionMode, selectedFeature, storedJWT, dispatch]);

  useEffect(() => {
    if (selectedTeam && storedJWT) {
      dispatch(
        loadTaskLists({
          team: selectedTeam,
          jwt: storedJWT,
          done: () => {},
        })
      );
    }
  }, [selectedTeam, storedJWT, dispatch]);

  const { setAppMenuActiveMenuSection, setAppMenuVisible } = useContext(UIDispatchContext);

  let loginForm = null;

  const showLogin = storedJWT === "" || storedJWT === undefined || storedJWT === null;
  if (showLogin) {
    loginForm = (
      <LoginForm
        key={"login."}
        setJWT={(jwt) => {
          dispatch(storeJWT(jwt));
        }}
        loginInfo={loginInfo}
        setLoginInfo={setLoginInfo}
        setLoggedOut={setLoggedOut}
      />
    );
  } else {
  }

  useEffect(() => {
    if (browserlocation.search === "") {
      history.push(
        history.location.pathname + "?lat=51.27185783523219&lng=7.200121618952836&zoom=19"
      );
    }
  }, [history, browserlocation]);

  useEffect(() => {
    if (storedJWT) {
      if (window["dbInit"] === true) {
        dispatch(resyncDb());
      } else {
        dispatch(initialize());
      }
    }
  }, [storedJWT]);

  useEffect(() => {
    if (onlineStatus === true) {
      dispatch(resyncDb());
      dispatch(setDone(true));
    }
  }, [onlineStatus]);

  // const photoBoxTitle = useSelector(getTitle);
  // const photourls = useSelector(getPhotoUrls);
  // const captions = useSelector(getCaptions);
  // const lightBoxIndex = useSelector(getIndex);
  // const lightBoxVisible = useSelector(isVisible);

  //defaultContextValues={{
  //   title: photoBoxTitle,
  //   photourls,
  //   captions,
  //   index: lightBoxIndex,
  //   visible: lightBoxVisible,y
  //   setVisible: (vis) => {
  //     dispatch(setVisible(vis));
  //   },
  //   setIndex: (i) => {
  //     dispatch(setIndex(i));
  //   },
  //   reactModalStyle: { overlay: { zIndex: 60000000 } },
  // }}

  return (
    <div ref={refApp}>
      <PhotoLightBox reactModalStyleOverride={{ overlay: { zIndex: 60000000 } }} />
      <Menu
        hide={() => {
          setAppMenuVisible(false);
        }}
        jwt={storedJWT}
      />
      {appDialog}

      {showLogin && loginForm}
      <TopNavbar
        innerRef={refUpperToolbar}
        refRoutedMap={refRoutedMap}
        setCacheSettingsVisible={setAppMenuVisible}
        jwt={storedJWT}
      />
      <SideBar
        innerRef={refSideBar}
        refRoutedMap={refRoutedMap}
        setCacheSettingsVisible={setAppMenuVisible}
        height={mapStyle.height - 100}
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
        jwt={storedJWT}
      />
      <BottomNavbar
        setAppMenuVisible={setAppMenuVisible}
        setAppMenuActiveMenuSection={setAppMenuActiveMenuSection}
        innerRef={refLowerToolbar}
        onlineStatus={onlineStatus}
        refRoutedMap={refRoutedMap}
        jwt={storedJWT}
      />
    </div>
  );
};

export default View;
