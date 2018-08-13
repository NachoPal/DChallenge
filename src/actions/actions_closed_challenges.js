const web3 = require('../initializers/web3');
import _ from 'lodash';
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_CLOSED_CHALLENGES
} from '../initializers/action_types';
import { encodedEventSignature, numberTo32bytes } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';
import getChallengesIndex from './helpers/get_challenges_index';


export function fetchClosedChallenges() {
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [encodedEventSignature("challengeClosed", implementationAbi)]
    }).then((logs) => {
        var indexes = getChallengesIndex(logs, "challengeClosed");
        indexes = _.map(indexes, (index) => {return numberTo32bytes(index)});

        web3.eth.getPastLogs({
          fromBlock: "0x1",
          address: proxyAddress,
          topics: [
            encodedEventSignature("challengeCreation", implementationAbi),
            indexes
          ]
        }).then((logs) => {
              buildChallengesObject(logs, dispatch, FETCH_CLOSED_CHALLENGES)
          });
      });
  }
}

// export function checkOraclizeLogs() {
//   return (dispatch) => {
//     web3.eth.getPastLogs({
//       fromBlock: "0x1",
//       address: proxyAddress,
//       topics: [encodedEventSignature("challengeCreation", implementationAbi)]
//     }).then((logs) => {
//       console.log("ORACLIZE LOGS", logs);
//       return dispatch({
//         type: "test",
//         action: null
//       });
//     });
//   }
// }
