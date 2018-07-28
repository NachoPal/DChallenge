const web3 = require('../initializers/web3');
var mnid = require('mnid');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_YOUR_CLOSED_CHALLENGES
} from '../initializers/action_types';
import buildChallengesObject from './helpers/build_challenges_object';
import {
  getAbiByFunctionNames,
  encodedEventSignature,
  userAddressTo32Bytes,
  numberTo32bytes
} from '../helpers/helper_web3';


export function fetchYourClosedChallenges(userAddress) {
  userAddress = userAddressTo32Bytes(userAddress);

  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: 1,
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
          fromBlock: 1,
          address: proxyAddress,
          topics: [encodedEventSignature("challengeCreation", implementationAbi), challengesId]
        }).then((logs) => {
            buildChallengesObject(logs, dispatch, FETCH_YOUR_CLOSED_CHALLENGES)
          });
      });
  }
}
