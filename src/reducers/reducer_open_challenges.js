import _ from 'lodash';
import {
  FECTH_OPEN_CHALLENGES,
  UPDATE_OPEN_CHALLENGES,
  FETCH_NUMBER_OF_PARTICIPANTS,
  UPDATE_NUMBER_OF_PARTICIPANTS
} from '../initializers/action_types';

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FECTH_OPEN_CHALLENGES:
      //const newChallenges = action.payload;
      //console.log(newChallenges);
      //return { ...state, ...newChallenges };
      return action.payload;
    case UPDATE_OPEN_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };
      //return { ...state, ...newChallenge };
    case FETCH_NUMBER_OF_PARTICIPANTS:
      //console.log('FETCH_MUMBER', action.payload.id)
      var newState = { ...state };
      var itemToUpdate = newState[action.payload.id];
      itemToUpdate.participants = action.payload.participants;
      console.log("ESTTO", {[action.payload.id]:  itemToUpdate})
      return { ...state, [action.payload.id]:  itemToUpdate }
    case UPDATE_NUMBER_OF_PARTICIPANTS:
      const currentParticipants = state[action.payload].participants;
      var newState = {
        ...state,
        [action.payload]: {
          ...state[action.payload],
            participants: currentParticipants
        }
      };
      var itemToUpdate = newState[action.payload];
      itemToUpdate.participants = itemToUpdate.participants + 1;
      console.log("LLEGA AQUI ID", action.payload);
      console.log("LLEGA AQUI ITEM", itemToUpdate);
      return { ...state, [action.payload]: itemToUpdate }
    default:
      console.log("===== Entra en OPEN reducer ===== ")
      return {...state };
  }
}
