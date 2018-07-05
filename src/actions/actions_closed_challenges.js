import {
  FECTH_CLOSED_CHALLENGES
} from '../initializers/action_types';

export function fetchClosedChallenges() {
  //WEB3: HERE I MAKE A CALL TO FETCH CLOSED CHALLENGES
  const closedChallenges = {};

  return {
    type: FECTH_CLOSED_CHALLENGES,
    payload: closedChallenges
  }
}
