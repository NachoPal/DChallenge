const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_CHALLENGE,
} from '../initializers/action_types';
import {
  encodedEventSignature,
  numberTo32bytes
 } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';


export function fetchChallenge(id) {
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: 1,
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeCreation", implementationAbi),
        numberTo32bytes(id)
      ]
    }).then((logs) => {
          buildChallengesObject(logs, dispatch, FETCH_CHALLENGE)
      });
  }
}

// export function updateOpenChallenges() {
//   return dispatch => {
//     const subscription = web3.eth.subscribe('logs', {
//       address: proxyAddress,
//       topics: [encodedEventSignature("challengeCreation", implementationAbi)]
//     }, (error, result) => {
//         if(!error) console.log(result);
//     }).on("data", (logs) => {
//       buildChallengesObject([logs], dispatch, UPDATE_OPEN_CHALLENGES)
//     }).on("changed", (logs) => {
//     });
//   }
// }
