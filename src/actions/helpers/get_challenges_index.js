import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters, encodedEventSignature } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';

export default (logs, eventName) => {
  var decodedLogs = _.map( logs, (log) => {
                        var decoded = web3.eth.abi.decodeLog(
                                        getAbiByFunctionNames(implementationAbi)[eventName].inputs,
                                        log.data,
                                        _.drop(log.topics)
                                        );
                        console.log("Challenge Closed EVENT",decoded);
                        return decoded.id;
                    });
  return decodedLogs;
}
