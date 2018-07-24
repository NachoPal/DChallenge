import web3 from '../initializers/web3';
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  UPDATE_NUMBER_OF_SUBMISSIONS
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';

export function updateNumberOfSubmissions(challengeId) {
  return dispatch => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeParticipation", implementationAbi),
        web3.eth.abi.encodeParameter('uint256', challengeId)
      ]
    }, (error, result) => {
        if(!error) console.log(result);
    }).on("data", (logs) => {
      return dispatch({
        type: UPDATE_NUMBER_OF_PARTICIPANTS,
        payload: challengeId
      });
    }).on("changed", (logs) => {
      console.log(logs);
    });
  }
}
