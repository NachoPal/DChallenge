const web3 = require('../initializers/web3');
// import { proxyAddress } from '../initializers/proxy_info';
// import { implementationAbi } from '../initializers/implementation_info';
import {
  GET_CONFIRMED_BLOCK
} from '../initializers/action_types';
//import { encodedEventSignature } from '../helpers/helper_web3';
//import buildChallengesObject from './helpers/build_challenges_object';
//import { getAbiByFunctionNames, encodedEventSignature } from '../helpers/helper_web3';


export function getConfirmedBlockNumber() {
  return (dispatch) => {


    web3.eth.getBlockNumber()
    .then(result => {
      const currentBlock = result;
      const confirmedBlock = currentBlock - 6;
      console.log("sigo entrando");

      return dispatch({
               type: GET_CONFIRMED_BLOCK,
               payload: confirmedBlock
             });
    });
  }
}
