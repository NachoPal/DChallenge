import _ from 'lodash';
import {
  FECTH_OPEN_CHALLENGES,
  UPDATE_OPEN_CHALLENGES
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FECTH_OPEN_CHALLENGES:
      const newChallenges = action.payload;
      return { ...state, ...newChallenges };
    case UPDATE_OPEN_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };
    default:
      console.log("===== Entra en OPEN reducer ===== ")
      return state;
  }
}
