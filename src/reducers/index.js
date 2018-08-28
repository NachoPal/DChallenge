import { combineReducers } from 'redux';
import {reducer as FormReducer } from 'redux-form';

import OpenChallengesReducer from './reducer_open_challenges';
import OngoingChallengesReducer from './reducer_ongoing_challenges';
import ClosedChallengesReducer from './reducer_closed_challenges';

import UserReducer from './reducer_user';
import SubmitChallengeReducer from './reducer_submit_challenge';

import YourOpenChallengesReducer from './reducer_your_open_challenges';
import YourOngoingChallengesReducer from './reducer_your_ongoing_challenges';
import YourClosedChallengesReducer from './reducer_your_closed_challenges';

import ChallengeViewReducer from './reducer_challenge_view';

import OwnerReducer from './reducer_owner';


const rootReducer = combineReducers({
  challenge: ChallengeViewReducer,
  open: OpenChallengesReducer,
  ongoing: OngoingChallengesReducer,
  closed: ClosedChallengesReducer,
  user: UserReducer,
  yourOpen: YourOpenChallengesReducer,
  yourOngoing: YourOngoingChallengesReducer,
  yourClosed: YourClosedChallengesReducer,
  submit: SubmitChallengeReducer,
  form: FormReducer,
  owner: OwnerReducer
});

export default rootReducer;
