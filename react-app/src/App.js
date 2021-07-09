import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Map from './components/Map';
import Home from './components/Home';
import MapHome from './components/MapHome';
import EditForm from './components/EditForm';
import SearchedMap from "./components/SearchedMap";

// import NavBar from "./components/NavBar";
import { authenticate } from "./store/session";

function App() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      {/* <NavBar /> */}
      <Switch>
        <Route path="/maps/create/" exact={true}>
          <Map />
        </Route>
        <Route path="/maps/create/:id" exact={true}>
          <Map />
        </Route>
        <Route path="/login" exact={true}>
          <LoginForm
          />
        </Route>
        <Route path="/sign-up/" exact={true}>
          <SignUpForm  />
        </Route>
        <Route path='/' exact={true}>
            <Home />
        </Route>
        <Route path='/edit_profile/' exact={true}>
            <EditForm />
        </Route>
        <Route path="/maps/" exact={true}>
          <MapHome />
        </Route>
        <Route path="/maps/:id">
          <SearchedMap />
        </Route>
        <Route path='/*'>
          <SignUpForm />
        </Route>

      </Switch>
    </BrowserRouter>
  );
}

export default App;
