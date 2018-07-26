import _ from 'lodash';
import {
  FETCH_CHALLENGE,
  FETCH_VIDEOS,
  REMOVE_CHALLENGE_DATA
} from '../initializers/action_types';

const INITIAL_STATE = {details: {}, videos: []};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_CHALLENGE:
      return { ...state, details: action.payload };
    case FETCH_VIDEOS:
      return { ...state, videos: action.payload }
    case REMOVE_CHALLENGE_DATA:
      return INITIAL_STATE;
    default:
      return { ...state };
  }
}
