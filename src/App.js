import { ConfigProvider } from "antd";
import deDE from "antd/lib/locale/de_DE";
import React from "react";
import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import { defaultLayerConf } from "react-cismap/tools/layerFactory";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import AppErrorFallback from "./components/AppErrorFallback";
import { backgroundConfigurations, backgroundModes, offlineConfig } from "./constants/belis";
import MobileApp from "./containers/MobileApp";
import Test from "./containers/Test";
import store from "./core/store";
import { appKey, storagePostfix } from "./Keys";

import "./App.css";
import "antd/dist/antd.css";

let persistor = persistStore(store);

const baseLayerConf = { ...defaultLayerConf };
if (!baseLayerConf.namedLayers.cismetLight) {
  baseLayerConf.namedLayers.cismetLight = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/cismet-light/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
  };
}
if (!baseLayerConf.namedLayers.osmBrightOffline) {
  baseLayerConf.namedLayers.osmBrightOffline = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/osm-bright-grey/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
  };
}
if (!baseLayerConf.namedLayers.osmBrightOffline_pale) {
  baseLayerConf.namedLayers.osmBrightOffline_pale = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/osm-bright-grey/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
    opacity: 0.3,
    iconOpacity: 0.6,
    textOpacity: 0.6,
  };
}
if (!baseLayerConf.namedLayers.klokantech_basic) {
  baseLayerConf.namedLayers.klokantech_basic = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/klokantech-basic/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
  };
}
if (!baseLayerConf.namedLayers.dark_matter) {
  baseLayerConf.namedLayers.dark_matter = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/dark-matter/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
  };
}
if (!baseLayerConf.namedLayers.dark_matter_pale) {
  baseLayerConf.namedLayers.dark_matter_pale = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/dark-matter/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
    opacity: 0.5,
    iconOpacity: 1,
    textOpacity: 1,
  };
}

function App() {
  //check for queryParam artificialError

  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={AppErrorFallback}>
        <ConfigProvider locale={deDE}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <div className='App'>
                <Switch>
                  <Route path='/app'>
                    <MobileApp />
                  </Route>

                  <Route path='/test'>
                    <Test />
                  </Route>

                  <Route path='/'>
                    <TopicMapContextProvider
                      appKey={appKey + "." + storagePostfix}
                      backgroundModes={backgroundModes}
                      backgroundConfigurations={backgroundConfigurations}
                      baseLayerConf={baseLayerConf}
                      offlineCacheConfig={offlineConfig}
                      persistenceSettings={{
                        ui: ["appMenuVisible", "appMenuActiveMenuSection", "collapsedInfoBox"],
                        featureCollection: ["filterState", "filterMode", "clusteringEnabled"],
                        responsive: [],
                        styling: [
                          "activeAdditionalLayerKeys",
                          "namedMapStyle",
                          "selectedBackground",
                          "markerSymbolSize",
                        ],
                        offlinelayers: ["vectorLayerOfflineEnabled"],
                      }}
                    >
                      <MobileApp />
                    </TopicMapContextProvider>
                  </Route>
                </Switch>
              </div>
            </Router>
          </PersistGate>
        </ConfigProvider>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
