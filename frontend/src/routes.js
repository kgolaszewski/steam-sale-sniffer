import React from 'react';
import { Route } from 'react-router-dom';
import Hoc from './hoc'

import GameList from './containers/GameList'
import Login from './containers/Login'

const BaseRouter = () => (
    <Hoc>
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={GameList} />
    </Hoc>
)

export default BaseRouter;