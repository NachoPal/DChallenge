import { combineReducers } from 'redux';
import OpenChallengesReducer from './reducer_open_challenges'

const rootReducer = combineReducers({
  open: OpenChallengesReducer
});

export default rootReducer;
