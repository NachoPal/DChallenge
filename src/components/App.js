import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  CLOSED_CHALLENGES_PATH,
  ONGOING_CHALLENGES_PATH ,
  OPEN_CHALLENGES_PATH,
  LANDING_PATH,
  YOUR_CHALLENGES_PATH,
  CHALLENGE_PATH
} from '../initializers/routes';
import TopNav from '../containers/TopNav';
import Landing from '../containers/Landing';
import OpenChallenges from '../containers/OpenChallenges';
import OngoingChallenges from '../containers/OngoingChallenges';
import ClosedChallenges from '../containers/ClosedChallenges';
import YourChallenges from '../containers/YourChallenges';
import ChallengeView from '../components/ChallengeView';

// const ChallengeViewWithProps = (props) => {
//   return(
//     <ChallengeView item={null} />
//   );
// }

const App = function() {
  return (
      <BrowserRouter>
        <div>
            <Route path="/" component={TopNav}/>
          <Switch>
            <Route path={`${CHALLENGE_PATH}/:id`} component={ChallengeView} />
            <Route path={YOUR_CHALLENGES_PATH} component={YourChallenges} />
            <Route path={CLOSED_CHALLENGES_PATH} component={ClosedChallenges} />
            <Route path={ONGOING_CHALLENGES_PATH} component={OngoingChallenges} />
            <Route path={OPEN_CHALLENGES_PATH} component={OpenChallenges} />
            <Route path={LANDING_PATH} component={Landing} />
          </Switch>
        </div>
      </BrowserRouter>
  );
}

export default App;
