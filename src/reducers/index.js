import { combineReducers } from 'redux';
import OpenChallengesReducer from './reducer_open_challenges';
import OngoingChallengesReducer from './reducer_ongoing_challenges';
import ClosedChallengesReducer from './reducer_closed_challenges';

import UserReducer from './reducer_user';
import SubmitChallengeReducer from './reducer_submit_challenge';

import YourOpenChallengesReducer from './reducer_your_open_challenges';
import YourOngoingChallengesReducer from './reducer_your_ongoing_challenges';

import ChallengeViewReducer from './reducer_challenge_view';


const rootReducer = combineReducers({
  challenge: ChallengeViewReducer,
  open: OpenChallengesReducer,
  ongoing: OngoingChallengesReducer,
  closed: ClosedChallengesReducer,
  user: UserReducer,
  yourOpen: YourOpenChallengesReducer,
  yourOngoing: YourOngoingChallengesReducer,
  submit: SubmitChallengeReducer,
});

export default rootReducer;
