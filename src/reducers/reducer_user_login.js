import {
  USER_LOGIN,
  USER_LOGOUT
} from '../initializers/action_types';

const INITIAL_STATE = {logged: false, details: null, challenges: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_LOGIN:
      return {...state, logged: true, details: action.payload};

    case USER_LOGOUT:
      return {...state, details: null};

    default:
      //return INITIAL_STATE;
      return {...state}
  }
}
