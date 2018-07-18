import {
  GET_CONFIRMED_BLOCK
} from '../initializers/action_types';

const INITIAL_STATE = {
  code: null,
  confirmedBlock: null,
  userAddress: null
}

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case GET_CONFIRMED_BLOCK:
      return action.payload;
    default:
      return {...state };
  }
}
