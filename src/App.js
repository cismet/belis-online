import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MobileApp from "./containers/MobileApp";
import Test from "./containers/Test";
import { Provider } from "react-redux";
import store from "./core/store";
import "antd/dist/antd.css";
import { PersistGate } from "redux-persist/integration/react";
import { backgroundConfigurations, backgroundModes, offlineConfig } from "./constants/belis";

import { persistStore } from "redux-persist";
import TopicMapContextProvider, {
  TopicMapContext,
} from "react-cismap/contexts/TopicMapContextProvider";
import { defaultLayerConf } from "react-cismap/tools/layerFactory";
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
if (!baseLayerConf.namedLayers.klokantech_basic) {
  baseLayerConf.namedLayers.klokantech_basic = {
    type: "vector",
    style: "https://omt.map-hosting.de/styles/klokantech-basic/style.json",
    offlineAvailable: true,
    offlineDataStoreKey: "wuppBasemap",
    pane: "backgroundvectorLayers",
  };
}

function App() {
  return (
    <Provider store={store}>
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
                  appKey='belis-online3.0'
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
    </Provider>
  );
}

export default App;
