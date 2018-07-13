import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters, encodedEventSignature } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';
import { proxyOptions, proxyAddress } from '../../initializers/proxy_info';

export default (logs, dispatch, action) => {
  var promises = [];
  var promises2 = [];

  var decodedLogs = _.map( logs, (log) => {
                        var decoded = web3.eth.abi.decodeLog(
                                        getAbiByFunctionNames(implementationAbi)["challengeCreation"].inputs,
                                        log.data,
                                        _.drop(log.topics)
                                        );
                        decoded.transactionHash = log.transactionHash;
                        return decoded;
                    });

  _.map(decodedLogs, (decodedLog) => {
      promises.push(web3.eth.call(proxyOptions('challenges', {id: parseInt(decodedLog.id)})));
  });

  Promise.all(promises).then(parametersArray => {
    _.map(parametersArray, parametersBytes => {
        const parameters = decodeParameters('challenges',
                                             implementationAbi,
                                             parametersBytes);
        _.map(decodedLogs, (decodedLog) => {
            const sameTitle = decodedLog.title == parameters['title'];
            const sameTime = decodedLog.openTime == parameters['openTime'] ;
            const sameChallenge = sameTitle && sameTime;

            if(sameChallenge) {
              _.assign(decodedLog, parameters);
              decodedLog.openTime = parseInt(decodedLog.openTime);
              decodedLog.closeTime = parseInt(decodedLog.closeTime);
              decodedLog.title = web3.utils.hexToString(decodedLog.title);
              decodedLog["participants"] = null;

              promises2.push(web3.eth.getPastLogs({
                fromBlock: 1,
                address: proxyAddress,
                topics: [
                  encodedEventSignature("userParticipation", implementationAbi),
                  web3.eth.abi.encodeParameter('uint256', decodedLog.id)
                ]
              }));
            }
        });
    });



    var count = 0;

    Promise.all(promises2).then(logs => {
      _.map(logs, log => {
        decodedLogs[count].participants = log.length;
        count++;
      });

      decodedLogs = _.orderBy(decodedLogs, 'openTime', 'asc');
      return dispatch({
               type: action,
               payload: _.mapKeys(decodedLogs, 'id')
             });
    });
  });
}
