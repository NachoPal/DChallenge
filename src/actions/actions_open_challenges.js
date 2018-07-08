import { web3 } from '../initializers/web3';
import { proxyAddress } from '../initializers/proxy_info';
import {
  FECTH_OPEN_CHALLENGES
} from '../initializers/action_types';
import { challengeCreationEvent_V0 } from '../initializers/implementation_info';


export function fetchOpenChallenges() {
  return (dispatch) => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [challengeCreationEvent_V0]
    }).on("data", (log) => {
      console.log(log);
    });
  }

  const openChallenges = {};

  return {
    type: FECTH_OPEN_CHALLENGES,
    payload: openChallenges
  }
}
