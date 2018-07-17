import { combineReducers } from 'redux';
import OpenChallengesReducer from './reducer_open_challenges';
import OngoingChallengesReducer from './reducer_ongoing_challenges';
import ClosedChallengesReducer from './reducer_closed_challenges';
import UserLoginReducer from './reducer_user_login';

import YourOpenChallengesReducer from './reducer_your_open_challenges';


const rootReducer = combineReducers({
  open: OpenChallengesReducer,
  ongoing: OngoingChallengesReducer,
  closed: ClosedChallengesReducer,
  user: UserLoginReducer,
  yourOpen: YourOpenChallengesReducer
});

export default rootReducer;
