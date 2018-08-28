const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_ONGOING_CHALLENGES,
  UPDATE_ONGOING_CHALLENGES
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';


export function fetchOngoingChallenges() {
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [encodedEventSignature("challengeCreation", implementationAbi)]
    }).then((logs) => {
          buildChallengesObject(logs, dispatch, FETCH_ONGOING_CHALLENGES)
      });
  }
}
