import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "react-cismap/topicMaps.css";
import "whatwg-fetch";
import ResponsiveTopicMapContextProvider from "react-cismap/contexts/ResponsiveTopicMapContextProvider";
import UIContextProvider from "react-cismap/contexts/UIContextProvider";

// import * as InfoboxStories from "./_stories/InfoBox.stories";

ReactDOM.render(
  <React.StrictMode>
    <ResponsiveTopicMapContextProvider
      enabled={true}
      appKey='belis-online3.0'
      persistenceSettings={{}}
    >
      <UIContextProvider
        appKey='belis-online3.0'
        persistenceSettings={{
          ui: ["appMenuVisible", "appMenuActiveMenuSection", "collapsedInfoBox"],
        }}
      >
        <App />
      </UIContextProvider>
    </ResponsiveTopicMapContextProvider>
  </React.StrictMode>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
