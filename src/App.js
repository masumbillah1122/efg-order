import React from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { IdleTimerContainer } from "./components/idleTimer/IdleTimerContainer";


import Master from "./pages/master/Index";

import ScrollToTop from "./components/scrollToTop/Index";


function App() {
  return (
    <div className="App">
      <IdleTimerContainer>
        <Router>
          <ScrollToTop>
            <Switch>
              <Route path="/">
                <Master />
              </Route>
            </Switch>
          </ScrollToTop>
        </Router>
      </IdleTimerContainer>
    </div>
  );
}

export default App;
