import web3 from '../initializers/web3';
import web3meta from "../initializers/web3_metamask";
import uport from "../initializers/uport";
var mnid = require('mnid');
import { proxyAddress, proxyOptions } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  UPDATE_NUMBER_OF_PARTICIPANTS,
  PARTICIPATE
} from '../initializers/action_types';
import { encodedEventSignature } from '../helpers/helper_web3';

export function participate(challengeId, userAddress, value, callback, managePendingTxModal) {
  return dispatch => {
    web3meta.eth.getAccounts((error, accounts) => {
      web3.eth.defaultAccount = accounts[0];

      const inputs = {
        challengeId: challengeId,
        //userAddress: mnid.decode(userAddress).address
      }
      const web3uport = uport.getWeb3()
      //web3meta.eth.sendTransaction(proxyOptions("participate", inputs, value, true), (error, txHash) => {
      web3uport.eth.sendTransaction(proxyOptions("participate", inputs, value), (error, txHash) => {
        if(!error) {
          const pendingTxInterval = setInterval(() => {
            web3.eth.getTransactionReceipt(txHash).then((receipt) => {
              if(receipt) {
                managePendingTxModal(false, txHash);
                clearInterval(pendingTxInterval);
                callback();
                return dispatch({
                  type: PARTICIPATE,
                  payload: challengeId
                });
              } else {
                managePendingTxModal(true, txHash);
              }
            });
          }, 1000);
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
