import _ from 'lodash';
import {
  FETCH_CHALLENGE,
  UPDATE_OPEN_CHALLENGES
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_CHALLENGE:
      return action.payload;
    case UPDATE_OPEN_CHALLENGES:
      const currentParticipants = state.participants;
      return { ...state, participants: currentParticipants + 1 }
    default:
      return INITIAL_STATE;
  }
}
