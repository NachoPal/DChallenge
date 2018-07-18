const web3 = require('../initializers/web3');
var mnid = require('mnid');
// import { proxyAddress } from '../initializers/proxy_info';
// import { implementationAbi } from '../initializers/implementation_info';
import {
  GET_CONFIRMED_BLOCK
} from '../initializers/action_types';
//import { encodedEventSignature } from '../helpers/helper_web3';
//import buildChallengesObject from './helpers/build_challenges_object';
//import { getAbiByFunctionNames, encodedEventSignature } from '../helpers/helper_web3';


export function getConfirmedBlockNumber(userAddress) {
  userAddress = mnid.decode(userAddress).address;

  return (dispatch) => {
    web3.eth.getBlockNumber()
    .then(result => {
      const currentBlock = result;
      const confirmedBlock = currentBlock - 6;
      web3.eth.getBlock(confirmedBlock)
      .then(result =>{
        console.log("code", result);
        const userAddressParam = {type: 'address', value: userAddress};
        const confirmedHashParam = {type: 'bytes32', value: result.hash};
        var code = web3.utils.soliditySha3(userAddressParam, confirmedHashParam);
        console.log("code",code);
        code = code.slice(2,6).toUpperCase();
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
