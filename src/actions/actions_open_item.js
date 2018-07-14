import web3 from '../initializers/web3';
import web3meta from "../initializers/web3_metamask";
import { proxyAddress, proxyOptions } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  UPDATE_NUMBER_OF_PARTICIPANTS,
  PARTICIPATE
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';

export function participate(challengeId) {
  return dispatch => {
    web3meta.eth.getAccounts((error, accounts) => {
      web3meta.eth.defaultAccount = accounts[0];
      console.log(accounts);

      web3meta.eth.sendTransaction(proxyOptions("participate", {id: challengeId}), (error, txHash) => {
        if(!error) {
          console.log("TRANSACTION", txHash);
          return dispatch({
            type: PARTICIPATE,
            payload: challengeId
          });
        } else {
          console.log("ERROR", error);
        }
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
