import { combineReducers } from 'redux';
import TopNavReducer from './reducer_top_nav'

const rootReducer = combineReducers({
  topNav: TopNavReducer
});

export default rootReducer;
