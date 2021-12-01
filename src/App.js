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

import { persistStore } from "redux-persist";
let persistor = persistStore(store);

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
                <MobileApp />
              </Route>
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
