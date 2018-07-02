import {
  LANDING,
  OPEN_CHALLENGES
} from '../initializers/action_types';

import {
  OPEN_CHALLENGES_PATH ,
  LANDING_PATH
} from '../initializers/routes';

export function setCurrentRoute(path) {
  switch (path) {
    case LANDING_PATH:
      return {
        type: LANDING,
        payload: path
      }

    case OPEN_CHALLENGES_PATH:
      return {
        type: OPEN_CHALLENGES,
        payload: path
      }
  }

  return {
    type: null,
    payload: null
  }
}
