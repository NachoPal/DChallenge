const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_YOUR_OPEN_CHALLENGES,
  UPDATE_YOUR_OPEN_CHALLENGES
} from '../initializers/action_types';
import buildChallengesObject from './helpers/build_challenges_object';
import {
  getAbiByFunctionNames,
  encodedEventSignature,
  userAddressTo32Bytes,
  numberTo32bytes
} from '../helpers/helper_web3';


export function fetchYourOpenChallenges(userAddress) {
  userAddress = userAddressTo32Bytes(userAddress)
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [encodedEventSignature("challengeParticipation", implementationAbi), null, userAddress]
    }).then((logs) => {
      var decodedLogs = _.map( logs, (log) => {

                            var decoded = web3.eth.abi.decodeLog(
                                            getAbiByFunctionNames(implementationAbi)["challengeParticipation"].inputs,
                                            log.data,
                                            [log.topics[1],log.topics[2]]);
                            return decoded;
                        });
        const challengesId = _.map(decodedLogs, decodedLog => {
          return numberTo32bytes(decodedLog.id);
        });
        web3.eth.getPastLogs({
          fromBlock: "0x1",
          address: proxyAddress,
          topics: [encodedEventSignature("challengeCreation", implementationAbi), challengesId]
        }).then((logs) => {
            buildChallengesObject(logs, dispatch, FETCH_YOUR_OPEN_CHALLENGES)
          });
      });
  }
}

export function updateYourOpenChallenges(userAddress) {
  userAddress = userAddressTo32Bytes(userAddress)
  return dispatch => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [encodedEventSignature("challengeParticipation", implementationAbi), null, userAddress]
    }, (error, result) => {
        if(!error) {}
    }).on("data", (log) => {
      var decodedLog = web3.eth.abi.decodeLog(
        getAbiByFunctionNames(implementationAbi)["challengeParticipation"].inputs,
        log.data,
        _.drop(log.topics)
      );

      web3.eth.getPastLogs({
        fromBlock: "0x1",
        address: proxyAddress,
        topics: [
          encodedEventSignature("challengeCreation", implementationAbi),
          [numberTo32bytes(decodedLog.id)],
        ]
      }).then((logs) => {
            buildChallengesObject(logs, dispatch, UPDATE_YOUR_OPEN_CHALLENGES)
        });
    }).on("changed", (logs) => {

    });
  }
}
