import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "react-cismap/topicMaps.css";

// don't know yet
// import "react-cismap/topicMaps.css";

import * as InfoboxStories from "./_stories/InfoBox.stories";
ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <InfoboxStories.SimpleTopicMapWithDefaultInfoBox /> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
