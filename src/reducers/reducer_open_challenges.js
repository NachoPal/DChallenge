import _ from 'lodash';
import {
  FECTH_OPEN_CHALLENGES,
  UPDATE_OPEN_CHALLENGES
} from '../initializers/action_types';

//BORRAR CUANDO SE HAGA EL FETCH DESDE WEB3
const URL_BASE = 'http://www.rubyonblockchain.com/wp-content/uploads/'
const open = [
  {id: 1, title: "Challenge #1", description: "Very difficult challenge my maaaaaama", img: `${URL_BASE}token-640x300.jpg`, enrolled: 98, time: 500},
  {id: 2, title: "Challenge #2", description: "Very difficult challenge my maaaaaama", img: `${URL_BASE}transaction-640x300.jpg`, enrolled: 98, time: 500},
  {id: 3, title: "Challenge #3", description: "Very difficult challenge my maaaaaama", img: `${URL_BASE}comunication-640x300.jpg`, enrolled: 98, time: 500},
  {id: 4, title: "Challenge #4", description: "Very difficult challenge my maaaaaama", img: `${URL_BASE}call-transaction-640x300.jpg`, enrolled: 98, time: 500},
  {id: 5, title: "Challenge #4", description: "Very difficult challenge my maaaaaama", img: `${URL_BASE}abi-640x300.jpg`, enrolled: 98, time: 500}];
//-------------------------------------------------

const INITIAL_STATE = null;

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case FECTH_OPEN_CHALLENGES:
      const newChallenges = action.payload;
      return { ... state, ...newChallenges };
    case UPDATE_OPEN_CHALLENGES:
      const newChallenge = action.payload;
      return { ...newChallenge, ...state };
    default:
      return INITIAL_STATE;
  }
}
