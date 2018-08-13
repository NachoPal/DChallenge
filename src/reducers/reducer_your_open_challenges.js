import _ from 'lodash';
import {
  FETCH_YOUR_OPEN_CHALLENGES,
  UPDATE_YOUR_OPEN_CHALLENGES,
  UPDATE_YOUR_NUMBER_OF_PARTICIPANTS
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_YOUR_OPEN_CHALLENGES:
      return action.payload;
    case UPDATE_YOUR_OPEN_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };
    case UPDATE_YOUR_NUMBER_OF_PARTICIPANTS:
      const currentParticipants = state[action.payload].participants;
      var newState = {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          //participants: currentParticipants
          participants: currentParticipants + 1
        }
      };
      //var itemToUpdate = newState[action.payload];
      //itemToUpdate.participants = itemToUpdate.participants + 1;
      //return { ...state, [action.payload]: itemToUpdate }
      return newState;
    default:
      return {...state };
  }
}
