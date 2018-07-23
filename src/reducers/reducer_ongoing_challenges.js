import _ from 'lodash';
import {
  FETCH_ONGOING_CHALLENGES,
  UPDATE_ONGOING_CHALLENGES,
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_ONGOING_CHALLENGES:
      return action.payload;

    case UPDATE_ONGOING_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };

    default:
      return {...state};
  }
}
