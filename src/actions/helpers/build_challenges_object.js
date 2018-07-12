import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';
import { proxyOptions } from '../../initializers/proxy_info';

export default (logs, dispatch, action) => {
  var promises = [];

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
            }
        });
  });
    decodedLogs = _.orderBy(decodedLogs, 'openTime', 'asc');
    return dispatch({
             type: action,
             payload: _.mapKeys(decodedLogs, 'transactionHash')
           });
  });
}
