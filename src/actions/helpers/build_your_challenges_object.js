import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters, encodedEventSignature } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';
import { proxyOptions, proxyAddress } from '../../initializers/proxy_info';
import {
  FETCH_YOUR_OPEN_CHALLENGES,
  // FETCH_ONGOING_CHALLENGES,
  // UPDATE_OPEN_CHALLENGES
} from '../../initializers/action_types';

export default (logs, dispatch, action) => {
  var promises = [];
  var promises2 = [];
  var challenges = {};

  var decodedLogs = _.map( logs, (log) => {
                        var decoded = web3.eth.abi.decodeLog(
                                        getAbiByFunctionNames(implementationAbi)["userParticipation"].inputs,
                                        log.data,
                                        _.drop(log.topics)
                                        );
                        //decoded.transactionHash = log.transactionHash;
                        return decoded;
                    });
  console.log("DECODED LOGS", decodedLogs);

  _.map(decodedLogs, (decodedLog) => {
      var id = parseInt(decodedLog.challengeId);
      challenges[id] = {};
      promises.push(web3.eth.call(proxyOptions('challenges', {challengeId: id})));
  });

  var parameters = [];

  Promise.all(promises).then(parametersArray => {
    var count = 0;
    _.map(parametersArray, parametersBytes => {
      var key = Object.entries(challenges)[count][0];
      challenges[key] = decodeParameters('challenges',
                                       implementationAbi,
                                       parametersBytes);
    });
  });

  console.log("challenges",challenges);

  return dispatch({
               type: action,
               //payload: _.mapKeys(decodedLogs, 'id')
               payload: decodedLogs
             });

  // _.map(decodedLogs, (decodedLog) => {
  //     promises.push(web3.eth.call(proxyOptions('challenges', {id: parseInt(decodedLog.id)})));
  // });
  //
  // Promise.all(promises).then(parametersArray => {
  //   _.map(parametersArray, parametersBytes => {
  //       const parameters = decodeParameters('challenges',
  //                                            implementationAbi,
  //                                            parametersBytes);
  //       _.map(decodedLogs, (decodedLog) => {
  //           const sameTitle = decodedLog.title == parameters['title'];
  //           const sameTime = decodedLog.openTime == parameters['openTime'] ;
  //           const sameChallenge = sameTitle && sameTime;
  //
  //           if(sameChallenge) {
  //             _.assign(decodedLog, parameters);
  //             decodedLog.openTime = parseInt(decodedLog.openTime);
  //             decodedLog.closeTime = parseInt(decodedLog.closeTime);
  //             decodedLog.title = web3.utils.hexToString(decodedLog.title);
  //             decodedLog["participants"] = null;
  //
  //             if(decodedLog.openTime > Date.now()) {
  //               decodedLog["status"] = "open";
  //             }else if(decodedLog.openTime <= Date.now() && decodedLog.closeTime > Date.now()) {
  //               decodedLog["status"] = "ongoing";
  //             }else if(decodedLog.closeTime < Date.now()) {
  //               decodedLog["status"] = "closed";
  //             }
  //             console.log("Challenges",decodedLogs);
  //
  //             promises2.push(web3.eth.getPastLogs({
  //               fromBlock: 1,
  //               address: proxyAddress,
  //               topics: [
  //                 encodedEventSignature("userParticipation", implementationAbi),
  //                 web3.eth.abi.encodeParameter('uint256', decodedLog.id)
  //               ]
  //             }));
  //
  //             //AQUI HAGO LA LLAMADA AL EVENTO DE CHALLENGE SUBMISSION
  //             decodedLog["submissions"] = 0;
  //           }
  //       });
  //   });
  //
  //
  //
  //   var count = 0;
  //
  //   Promise.all(promises2).then(logs => {
  //     _.map(logs, log => {
  //       decodedLogs[count].participants = log.length;
  //       count++;
  //     });
  //
  //     decodedLogs = decodedLogs.filter( (decodedLog) => {
  //       switch(action) {
  //         case FETCH_OPEN_CHALLENGES || UPDATE_OPEN_CHALLENGES:
  //           return decodedLog.status == "open";
  //           case UPDATE_OPEN_CHALLENGES:
  //             return decodedLog.status == "open";
  //         case FETCH_ONGOING_CHALLENGES:
  //           return decodedLog.status == "ongoing";
  //       }
  //     });
  //
  //     switch(action) {
  //       case FETCH_OPEN_CHALLENGES || UPDATE_OPEN_CHALLENGES:
  //         decodedLogs = _.orderBy(decodedLogs, 'openTime', 'asc');
  //       case FETCH_ONGOING_CHALLENGES:
  //         decodedLogs = _.orderBy(decodedLogs, 'closeTime', 'asc');
  //     }
  //
  //     console.log(decodedLogs);
  //
  //     return dispatch({
  //              type: action,
  //              payload: _.mapKeys(decodedLogs, 'id')
  //            });
  //   });
  // });
}
