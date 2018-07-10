const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FECTH_OPEN_CHALLENGES,
  UPDATE_OPEN_CHALLENGES
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';


export function fetchOpenChallenges() {
  return (dispatch) => {
    console.log(implementationAbi)
    web3.eth.getPastLogs({
      fromBlock: 1,
      address: proxyAddress,
      topics: [encodedEventSignature("challengeCreation", implementationAbi)]
    }).then((logs) => {
          console.log(logs);
          buildChallengesObject(logs, dispatch, FECTH_OPEN_CHALLENGES)
      });
  }
}

export function updateOpenChallenges() {
  // return dispatch => {
  //   const subscription = web3.eth.subscribe('logs', {
  //     address: proxyAddress,
  //     topics: [encodedEventSignature("challengeCreation")]
  //   }, (error, result) => {
  //       if(!error) console.log(result);
  //   }).on("data", (logs) => {
  //     console.log(logs);
  //     dispatch({
  //             type: UPDATE_OPEN_CHALLENGES,
  //             payload: log
  //           });
  //   }).on("changed", (logs) => {
  //     console.log(logs);
  //   });
  // }
}
