const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_YOUR_OPEN_CHALLENGES
} from '../initializers/action_types';
//import { encodedEventSignature } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';
import { getAbiByFunctionNames, encodedEventSignature } from '../helpers/helper_web3';


export function fetchYourOpenChallenges(userAddress) {
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
        console.log("CHALLENGE ID", challengesId);
        web3.eth.getPastLogs({
          fromBlock: 1,
          address: proxyAddress,
          topics: [encodedEventSignature("challengeCreation", implementationAbi), challengesId]
        }).then((logs) => {
          console.log("Porfi",logs);
            buildChallengesObject(logs, dispatch, FETCH_YOUR_OPEN_CHALLENGES)
          });

        //console.log("Lista de todos los logs", logs);
        //buildYourChallengesObject(logs, dispatch, FETCH_YOUR_OPEN_CHALLENGES)
      });
  }
}
