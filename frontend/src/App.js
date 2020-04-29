import './App.css';

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { connect } from 'react-redux'
import BaseRouter from './routes'
import 'antd/dist/antd.css'
import * as actions from './store/actions/auth'

import CustomLayout from './containers/Layout'

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  test() {
    const userId = localStorage.getItem('userId')
    console.log(userId)
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props}>
          <BaseRouter />
        </CustomLayout>
        <button onClick={() => this.test()}>Test</button>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);