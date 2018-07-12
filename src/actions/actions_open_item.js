import web3 from '../initializers/web3';
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_NUMBER_OF_PARTICIPANTS,
  UPDATE_NUMBER_OF_PARTICIPANTS
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';

export function fetchNumberOfParticipants(challengeId) {

  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: 1,
      address: proxyAddress,
      topics: [
        encodedEventSignature("userParticipation", implementationAbi),
        web3.eth.abi.encodeParameter('uint256', challengeId)
      ]
    }).then((logs) => {
        console.log('PARTICIPANTS', logs.length)
        return dispatch({
          type: FETCH_NUMBER_OF_PARTICIPANTS,
          payload: {id: challengeId, number:logs.length}
        });
    });
  }
}

export function updateNumberOfParticipants(challengeId) {
  return dispatch => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [
        encodedEventSignature("userParticipation", implementationAbi),
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
