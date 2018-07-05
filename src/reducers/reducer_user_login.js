import {
  USER_LOGIN,
  USER_LOGOUT
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_LOGIN:
      return action.payload;
    case USER_LOGOUT:
      return null;
    default:
      return INITIAL_STATE;
  }
}
