import web3 from '../../initializers/web3';
import { getAbiByFunctionNames, decodeParameters, encodedEventSignature } from '../../helpers/helper_web3';
import { implementationAbi } from '../../initializers/implementation_info';

export default (logs, dispatch, action) => {
  var decodedLogs = _.map( logs, (log) => {
                        var decoded = web3.eth.abi.decodeLog(
                                        getAbiByFunctionNames(implementationAbi)["challengeSubmission"].inputs,
                                        log.data,
                                        _.drop(log.topics)
                                        );
                        return {
                          ipfsHash: decoded.ipfsHash,
                          userAddress: decoded.userAddress,
                          code: decoded.code,
                          duration: decoded.videoDuration
                        }
                    });

  return dispatch({
    type: action,
    payload: _.mapKeys(decodedLogs, "userAddress")
  });
}
