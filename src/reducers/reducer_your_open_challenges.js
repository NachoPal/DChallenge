import _ from 'lodash';
import {
  FETCH_YOUR_OPEN_CHALLENGES,
  UPDATE_YOUR_OPEN_CHALLENGES
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_YOUR_OPEN_CHALLENGES:
      return action.payload;
    case UPDATE_YOUR_OPEN_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };
    default:
      return {...state };
  }
}
