const _ =  require('lodash');
const web3 = require('../initializers/web3.js');
var mnid = require('mnid');

// const getAbiByFunctionNames = (abi) => {
//   return _.mapKeys(abi,"name");
// }

module.exports = {
  encodedFunctionCall: (name, inputs, abi) => {
    return web3.eth.abi.encodeFunctionCall(getAbiByFunctionNames(abi)[name], inputs);
  },
  encodedFunctionSignature: (name, abi) => {
    return web3.eth.abi.encodeFunctionSignature(getAbiByFunctionNames(abi)[name]);
  },
  encodedEventSignature: (name, abi) => {
    return web3.eth.abi.encodeEventSignature(getAbiByFunctionNames(abi)[name]);
  },
  decodeParameters: (name, abi, parameters) =>{
    return web3.eth.abi.decodeParameters(getAbiByFunctionNames(abi)[name].outputs, parameters)
  },
  getAbiByFunctionNames: (abi) => {
    return _.mapKeys(abi,"name");
  },
  numberTo32bytes: (number) => {
      return ('0x' + web3.utils.padLeft(web3.utils.toBN(number).toString(16),64));
  },
  userAddressTo32Bytes: (address) => {
    return web3.utils.padLeft(mnid.decode(address).address, 64);
  }
}
