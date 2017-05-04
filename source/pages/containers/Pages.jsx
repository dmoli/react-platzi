import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Header from '../../shared/components/Header';
import Home from './Home';
import Post from './Post';
import Profile from './Profile';
import Error404 from './Error404';

function Pages() {
  return (
    <main role="application">
      <Header />
      <Switch>
        {/* Articles list */}
        <Route
          path="/"
          exact
          component={Home}
        />
        {/* Post detail */}
        <Route
          path="/post/:id"
          exact
          component={Post}
        />
        {/* User profile */}
        <Route
          path="/user/:id"
          exact
          component={Profile}
        />
        {/* Error */}
        <Route component={Error404} />
      </Switch>
    </main>
  );
}

export default Pages;
