import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
// import NavBar from "./components/NavBar";
import { authenticate } from "./store/session";

import Map_ from './components/Map';

function App() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Switch>
        <Route path="/" exact={true}>
          <Map_ />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm
          />
        </Route>
        <Route path="/sign-up" exact={true}>
          <SignUpForm  />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
