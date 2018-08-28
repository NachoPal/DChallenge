import _ from 'lodash';
import {
  FETCH_YOUR_ONGOING_CHALLENGES,
  UPDATE_YOUR_NUMBER_OF_SUBMISSIONS
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_YOUR_ONGOING_CHALLENGES:
      return action.payload;
    case UPDATE_YOUR_NUMBER_OF_SUBMISSIONS:
      const currentSubmissions = state[action.payload].submissions;
      var newState = {
        ...state,
        [action.payload]: {
          ...state[action.payload],
            submissions: currentSubmissions + 1
        }
      };
      return newState;
    default:
      return {...state };
  }
}
