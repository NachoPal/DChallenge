import {
  USER_LOGIN,
  USER_LOGOUT,
  FETCH_USER_CHALLENGES_INDEX,
  PARTICIPATE,
  SUBMIT_CHALLENGE
} from '../initializers/action_types';

const INITIAL_STATE = {logged: false, details: null, participating: [], submissions: []};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_LOGIN:
      return {...state, logged: true, details: action.payload};
    case USER_LOGOUT:
      return {...state, details: null, participating: [], submissions: []};
    case FETCH_USER_CHALLENGES_INDEX:
      console.log("hasta el reducer con", action.payload.participating);
      return {
        ...state,
        participating: action.payload.participating,
        submissions: action.payload.submissions
      };
    case PARTICIPATE:
      state.participating.push(action.payload);
      return {...state, participating: state.participating}
    case SUBMIT_CHALLENGE:
      state.submissions.push(action.payload.id);
      return {...state, submissions: state.submissions}
    default:
      //return INITIAL_STATE;
      return {...state}
  }
}
