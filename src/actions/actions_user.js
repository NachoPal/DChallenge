import {
  USER_LOGIN,
  USER_LOGIN_CANCELED,
  USER_LOGOUT,
  FETCH_USER_CHALLENGES_INDEX,
  FETCH_USER_BALANCE,
  WITHDRAW_USER_BALANCE

} from '../initializers/action_types';
import {
  YOUR_CHALLENGES_PATH
} from '../initializers/routes';
import uport from '../initializers/uport';
import {
  userAddressTo32Bytes,
  encodedEventSignature,
  decodeParameters
} from '../helpers/helper_web3';
import { implementationAbi } from '../initializers/implementation_info';
import { proxyAddress, proxyOptions } from '../initializers/proxy_info';
import getChallengesIndex from './helpers/get_challenges_index';
import web3 from '../initializers/web3';
import web3meta from '../initializers/web3_metamask';
var mnid = require('mnid');


export function userLogin() {
  return(dispatch) => {
    const userCredentials = uport.requestCredentials({
      requested: ['name', 'country', 'avatar', 'email', 'phone']
    });

    userCredentials.then( response => {
      dispatch({
              type: USER_LOGIN,
              payload: response
            });
    })
    .catch( (error) => {
      dispatch({
              type: USER_LOGIN_CANCELED,
              payload: error
            });
        });
  }
}

export function userLogout(location, callback) {
  sessionStorage.removeItem('user');
  if(location == YOUR_CHALLENGES_PATH) {
    callback();
  }
  return {
    type: USER_LOGOUT,
    payload: null
  }
}

export function fetchUserChallengesIndex(user, callback) {
  return(dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeParticipation", implementationAbi),
        null,
        userAddressTo32Bytes(user.details.address)
      ]
    }).then((logs) => {
      const participatingIndex = getChallengesIndex(logs, "challengeParticipation");
      web3.eth.getPastLogs({
        fromBlock: "0x1",
        address: proxyAddress,
        topics: [
          encodedEventSignature("challengeSubmission", implementationAbi),
          null,
          userAddressTo32Bytes(user.details.address)
        ]
      }).then((logs) => {
        const submissionIndex = getChallengesIndex(logs, "challengeSubmission");
        callback({...user, participating: participatingIndex, submissions: submissionIndex});
        return dispatch({
          type: FETCH_USER_CHALLENGES_INDEX,
          payload: {participating: participatingIndex, submissions: submissionIndex}
        });
      });
    });
  }
}

export function fetchUserBalance(userAddress) {
  return (dispatch) => {
    userAddress = mnid.decode(userAddress).address;
    const inputs = {
      userAddress: userAddress
    }
    web3.eth.call(proxyOptions("balances", inputs, 0, false))
    .then((balance) => {
      balance = parseInt(decodeParameters("balances", implementationAbi, balance)["0"]);
      return dispatch({
        type: FETCH_USER_BALANCE,
        payload: balance
      });
    });
  }
}

export function withdrawBalance(userAddress, amount) {
  return (dispatch) => {
    //web3meta.eth.getAccounts((error, accounts) => {
      //web3.eth.defaultAccount = accounts[0];

      const inputs = {
        amount: amount,
        userAddress: mnid.decode(userAddress).address
      }
      const web3uport = uport.getWeb3()
      //web3meta.eth.sendTransaction(proxyOptions("userWithdraw", inputs, 0, true), (error, txHash) => {
      web3uport.eth.sendTransaction(proxyOptions("userWithdraw", inputs, 0), (error, txHash) => {
        if(!error) {
          return dispatch({
            type: WITHDRAW_USER_BALANCE,
            payload: 0
          });
        } else {
          console.log("Withdraw error");
        }
      });
    //});
  }
}
