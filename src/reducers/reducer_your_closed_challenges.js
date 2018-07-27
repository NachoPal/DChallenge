import _ from 'lodash';
import {
  FETCH_YOUR_CLOSED_CHALLENGES,
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_YOUR_CLOSED_CHALLENGES:
      return action.payload;
    default:
      return {...state };
  }
}
