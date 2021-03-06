const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_OPEN_CHALLENGES,
  UPDATE_OPEN_CHALLENGES
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';


export function fetchOpenChallenges() {
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [encodedEventSignature("challengeCreation", implementationAbi)]
    }).then((logs) => {
          buildChallengesObject(logs, dispatch, FETCH_OPEN_CHALLENGES)
      });
  }
}

export function updateOpenChallenges() {
  return dispatch => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [encodedEventSignature("challengeCreation", implementationAbi)]
    }, (error, result) => {
        if(!error) {}
    }).on("data", (logs) => {
      buildChallengesObject([logs], dispatch, UPDATE_OPEN_CHALLENGES)
    }).on("changed", (logs) => {

    });
  }
}
