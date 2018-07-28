const web3 = require('../initializers/web3');
import web3meta from '../initializers/web3_metamask';
import { ipfs } from '../initializers/ipfs';
var mnid = require('mnid');
import _ from 'lodash';
import { proxyOptions } from '../initializers/proxy_info';
import {
  GET_CONFIRMED_BLOCK,
  ACCEPT_BUTTON_CLICKED,
  VIDEO_SUBMITTED,
  SUBMIT_CHALLENGE,
  ERROR_SUBMIT_CHALLENGE
} from '../initializers/action_types';


export function getConfirmedBlockNumber(userAddress) {
  userAddress = mnid.decode(userAddress).address;

  return (dispatch) => {
    web3.eth.getBlockNumber()
    .then(result => {
      const currentBlock = result;
      const confirmedBlock = currentBlock - 6;
      web3.eth.getBlock(confirmedBlock)
      .then(result =>{
        const userAddressParam = {type: 'address', value: userAddress};
        const confirmedHashParam = {type: 'bytes32', value: result.hash};
        var code = web3.utils.soliditySha3(userAddressParam, confirmedHashParam);

        return dispatch({
                 type: GET_CONFIRMED_BLOCK,
                 payload: {
                   code: code,
                   confirmedBlock: confirmedBlock,
                   userAddress: userAddress

                 }
               });
      });
    });
  }
}

export function acceptButtonClicked(bool) {
  return (dispatch) => {
    return dispatch({
             type: ACCEPT_BUTTON_CLICKED,
             payload: bool
           });
  }
}

export function submitVideo(buffer) {
  return (dispatch) => {
    ipfs.add(buffer, (err, ipfsHash) => {
      return dispatch({
        type: VIDEO_SUBMITTED,
        payload: ipfsHash[0].hash
      });
    });
  }
}

export function submitChallenge(state, callback) {
  return (dispatch) => {

    web3meta.eth.getAccounts((error, accounts) => {
      web3meta.eth.defaultAccount = accounts[0];

      const inputs = {
        id: state.id,
        confirmedBlock: state.confirmedBlock,
        code: state.code,
        videoDuration: state.videoDuration,
        ipfsHash: state.ipfsHash,
        userAddress: state.userAddress
      }

      web3meta.eth.sendTransaction(proxyOptions("submit", inputs, 0), (error, txHash) => {
        if(!error) {
          callback();
          return dispatch({
            type: SUBMIT_CHALLENGE,
            payload: state
          });
        } else {
          return dispatch({
            type: ERROR_SUBMIT_CHALLENGE,
            payload: error
          });
        }
      });
    });
  }
}
