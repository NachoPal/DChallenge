import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  CLOSED_CHALLENGES_PATH,
  ONGOING_CHALLENGES_PATH ,
  OPEN_CHALLENGES_PATH,
  LANDING_PATH
} from '../initializers/routes';
import TopNav from '../components/TopNav';
import Landing from '../containers/Landing';
import OpenChallenges from '../containers/OpenChallenges';
import OngoingChallenges from '../containers/OngoingChallenges';


const App = function() {
  return (
      <BrowserRouter>
        <div>
            <Route path="/" component={TopNav}/>
          <Switch>
            <Route path={ONGOING_CHALLENGES_PATH} component={OngoingChallenges} />
            <Route path={OPEN_CHALLENGES_PATH} component={OpenChallenges} />
            {/* <Route path={LANDING_PATH} component={ClosedChallenges} />*/}


            <Route path={LANDING_PATH} component={Landing} />
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
