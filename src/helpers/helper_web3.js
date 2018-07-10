const _ =  require('lodash');
const web3 = require('../initializers/web3.js');

const getAbiByFunctionNames = (abi) => {
  return _.mapKeys(abi,"name");
}

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
  getAbiByFunctionNames: getAbiByFunctionNames
}
