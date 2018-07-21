import _ from 'lodash';
import {
  FETCH_CLOSED_CHALLENGES
} from '../initializers/action_types';

//BORRAR CUANDO SE HAGA EL FETCH DESDE WEB3
const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/'

const INITIAL_STATE = open;

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_CLOSED_CHALLENGES:
      return {...state, open };
    default:
      return INITIAL_STATE;
  }
}
