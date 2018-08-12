import web3 from '../initializers/web3';
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  UPDATE_NUMBER_OF_SUBMISSIONS
} from '../initializers/action_types';
import { encodedEventSignature, numberTo32bytes } from '../helpers/helper_web3';

export function updateNumberOfSubmissions(challengeId) {
  return dispatch => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeSubmission", implementationAbi),
        numberTo32bytes(challengeId)
      ]
    }, (error, result) => {
        if(!error) {}
    }).on("data", (logs) => {
      return dispatch({
        type: UPDATE_NUMBER_OF_SUBMISSIONS,
        payload: challengeId
      });
    }).on("changed", (logs) => {
      console.log(logs);
    });
  }
}
