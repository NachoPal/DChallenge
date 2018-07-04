import {
  FECTH_ONGOING_CHALLENGES
} from '../initializers/action_types';

export function fetchOngoingChallenges() {
  //WEB3: HERE I MAKE A CALL TO FETCH OPEN CHALLENGES
  const ongoingChallenges = {};

  return {
    type: FECTH_ONGOING_CHALLENGES,
    payload: ongoingChallenges
  }
}
