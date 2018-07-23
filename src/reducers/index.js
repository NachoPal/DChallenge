import { combineReducers } from 'redux';
import OpenChallengesReducer from './reducer_open_challenges';
import OngoingChallengesReducer from './reducer_ongoing_challenges';
import ClosedChallengesReducer from './reducer_closed_challenges';

import UserLoginReducer from './reducer_user_login';
import SubmitChallengeReducer from './reducer_submit_challenge';

import YourOpenChallengesReducer from './reducer_your_open_challenges';
import YourOngoingChallengesReducer from './reducer_your_ongoing_challenges';

import ChallengeViewReducer from './reducer_challenge_view';


const rootReducer = combineReducers({
  challenge: ChallengeViewReducer,
  open: OpenChallengesReducer,
  ongoing: OngoingChallengesReducer,
  closed: ClosedChallengesReducer,
  user: UserLoginReducer,
  yourOpen: YourOpenChallengesReducer,
  yourOngoing: YourOngoingChallengesReducer,
  submit: SubmitChallengeReducer
});

export default rootReducer;
