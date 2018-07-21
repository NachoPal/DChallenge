const web3 = require('../initializers/web3');
var mnid = require('mnid');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_YOUR_ONGOING_CHALLENGES
} from '../initializers/action_types';
//import { encodedEventSignature } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';
import { getAbiByFunctionNames, encodedEventSignature } from '../helpers/helper_web3';


export function fetchYourOngoingChallenges(userAddress) {
  userAddress = web3.utils.padLeft(mnid.decode(userAddress).address, 64);
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: 1,
      address: proxyAddress,
      topics: [encodedEventSignature("userParticipation", implementationAbi), null, userAddress]
    }).then((logs) => {
      var decodedLogs = _.map( logs, (log) => {

                            var decoded = web3.eth.abi.decodeLog(
                                            getAbiByFunctionNames(implementationAbi)["userParticipation"].inputs,
                                            log.data,
                                            [log.topics[1],log.topics[2]]);
                            return decoded;
                        });
        const challengesId = _.map(decodedLogs, decodedLog => {
          return '0x' + web3.utils.padLeft(web3.utils.toBN(decodedLog.challengeId).toString(16),64);
        });

        web3.eth.getPastLogs({
          fromBlock: 1,
          address: proxyAddress,
          topics: [encodedEventSignature("challengeCreation", implementationAbi), challengesId]
        }).then((logs) => {
            buildChallengesObject(logs, dispatch, FETCH_YOUR_ONGOING_CHALLENGES)
          });

        //console.log("Lista de todos los logs", logs);
        //buildYourChallengesObject(logs, dispatch, FETCH_YOUR_OPEN_CHALLENGES)
      });
  }
}
