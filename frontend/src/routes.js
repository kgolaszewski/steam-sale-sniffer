import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Hoc from './hoc'

import GameList from './containers/GameList'
import Login from './containers/Login'
import Signup from './containers/Signup'
import WishList from './containers/WishList'
import Collection from './containers/Collection'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authenticated = localStorage.getItem("userId") !== null;
    return (
      <Route
        {...rest}
        render={props =>
          authenticated === true ? (
            <Component {...props} />
          ) : ( <Redirect to={{ pathname: "/login", state: { from: props.location } }} /> )
        }
      />
    );
  };

const BaseRouter = () => (
    <Hoc>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        {/* <Route exact path="/wishlist" component={WishList} /> */}
        {/* <Route exact path="/collection" component={Collection} /> */}
        <PrivateRoute path="/wishlist" component={WishList} />
        <PrivateRoute path="/collection" component={Collection} />
        <Route exact path="/" component={GameList} />
    </Hoc>
)

export default BaseRouter;