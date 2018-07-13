import _ from "lodash";
import {
  FETCH_NUMBER_OF_PARTICIPANTS,
  UPDATE_NUMBER_OF_PARTICIPANTS
} from '../initializers/action_types';

const INITIAL_STATE = {};

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FETCH_NUMBER_OF_PARTICIPANTS:
      
      return {
        ...state,
        idToUpdate: action.payload.id,
        items: {...state.items, [action.payload.id]: {number: action.payload.number}}
      };
    case UPDATE_NUMBER_OF_PARTICIPANTS:
    return {
      ...state,
      idToUpdate: action.payload,
      items: {...state.items, [action.payload]: {number: state.items[action.payload].number + 1}}
    };
    default:
      console.log("===== Entra en ITEM reducer ===== ")
      return state;
  }
}
