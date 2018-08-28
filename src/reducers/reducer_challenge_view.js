import _ from 'lodash';
import {
  FETCH_CHALLENGE,
  FETCH_VIDEOS,
  UPDATE_VIDEOS,
  REMOVE_CHALLENGE_DATA
} from '../initializers/action_types';

const INITIAL_STATE = {details: {}, videos: {}};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_CHALLENGE:
      return { ...state, details: action.payload };
    case FETCH_VIDEOS:
      return { ...state, videos: action.payload }
    case UPDATE_VIDEOS:
      const newVideoKey = Object.keys(action.payload)[0];
      const newVideoPayload = Object.values(action.payload)[0];
      const newSubmissions = state.details.submissions + 1;
      return {
        ...state,
        videos: {...state["videos"], [newVideoKey]: newVideoPayload },
        details: {... state["details"], submissions: newSubmissions}
      }
    case REMOVE_CHALLENGE_DATA:
      return INITIAL_STATE;
    default:
      return { ...state };
  }
}
