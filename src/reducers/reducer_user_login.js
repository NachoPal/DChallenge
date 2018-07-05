import {
  USER_LOGIN
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_LOGIN:
      return action.payload;
    default:
      return INITIAL_STATE;
  }
}
