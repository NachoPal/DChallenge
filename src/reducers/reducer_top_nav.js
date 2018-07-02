import {
  LANDING,
  OPEN_CHALLENGES
} from '../initializers/action_types';

const INITIAL_STATE = {
  path: "/",
  landing: false,
  openChallenges: false,
  onGoingChallenges: false,
  pastChallenges: false,
  myChallenges: false,
}

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case LANDING:
      return {
        ...state,
        path: action.payload,
        landing: true,
        openChallenges: false,
        pastChallenges: false,
        onGoingChallenges: false,
        myChallenges: false,
        }
    case OPEN_CHALLENGES:
      return {
        ...state,
        path: action.payload,
        landing: false,
        openChallenges: true,
        pastChallenges: false,
        onGoingChallenges: false,
        myChallenges: false,
        }
    default:
      return { ...state, INITIAL_STATE };
  }
}
