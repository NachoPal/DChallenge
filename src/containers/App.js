import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { OPEN_CHALLENGES_PATH , LANDING_PATH } from '../initializers/routes';
import Landing from '../containers/Landing';
import OpenChallenges from '../containers/OpenChallenges';
import TopNav from '../components/TopNav';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('App', this.props.topNav);
  }

  render() {
    return (
        <BrowserRouter>
          <div>
              <Route path="/" component={TopNav}/>
            <Switch>
              <Route path={OPEN_CHALLENGES_PATH} component={OpenChallenges} />
              <Route path={LANDING_PATH} component={Landing} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

function mapStateToProps({topNav}) {
  return {topNav};
}

export default connect(mapStateToProps)(App);
