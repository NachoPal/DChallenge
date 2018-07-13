import { combineReducers } from 'redux';
import OpenChallengesReducer from './reducer_open_challenges';
import OpenItemReducer from './reducer_open_item';
import OngoingChallengesReducer from './reducer_ongoing_challenges';
import ClosedChallengesReducer from './reducer_closed_challenges';
import UserLoginReducer from './reducer_user_login';

const rootReducer = combineReducers({
  open: OpenChallengesReducer,
  //openItem: OpenItemReducer,
  ongoing: OngoingChallengesReducer,
  closed: ClosedChallengesReducer,
  user: UserLoginReducer
});

export default rootReducer;
