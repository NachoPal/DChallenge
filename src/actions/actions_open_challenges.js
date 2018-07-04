import {
  FECTH_OPEN_CHALLENGES
} from '../initializers/action_types';

export function fetchOpenChallenges() {
  //WEB3: HERE I MAKE A CALL TO FETCH OPEN CHALLENGES
  const openChallenges = {};

  return {
    type: FECTH_OPEN_CHALLENGES,
    payload: openChallenges
  }
}
