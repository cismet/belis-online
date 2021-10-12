import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MobileApp from "./containers/MobileApp";
import Test from "./containers/Test";
import { Provider } from "react-redux";
import store from "./core/store";
import "antd/dist/antd.css";

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
