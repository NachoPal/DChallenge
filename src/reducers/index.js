import { combineReducers } from 'redux';
import OpenChallengesReducer from './reducer_open_challenges'
import OngoingChallengesReducer from './reducer_ongoing_challenges'

const rootReducer = combineReducers({
  open: OpenChallengesReducer,
  ongoing: OngoingChallengesReducer
});

export default rootReducer;
