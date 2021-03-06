import _ from 'lodash';
import {
  FETCH_OPEN_CHALLENGES,
  UPDATE_OPEN_CHALLENGES,
  FETCH_NUMBER_OF_PARTICIPANTS,
  UPDATE_NUMBER_OF_PARTICIPANTS,
  PARTICIPATE,
  USER_LOGIN
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_OPEN_CHALLENGES:
      return action.payload;

    case UPDATE_OPEN_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };

    case FETCH_NUMBER_OF_PARTICIPANTS:
      var newState = { ...state };
      var itemToUpdate = newState[action.payload.id];
      itemToUpdate.participants = action.payload.participants;
      return { ...state, [action.payload.id]:  itemToUpdate }

    case UPDATE_NUMBER_OF_PARTICIPANTS:
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
