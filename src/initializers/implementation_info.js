const web3 = require('./web3.js');
const _ =  require('lodash');
const implementationContract = require('../../build/contracts/DChallenge.json')

const networks_id = _.keys(implementationContract.networks);
const id = networks_id[networks_id.length-1];

const implementationAddress = implementationContract.networks[id].address;
const implementationAbi = implementationContract.abi;

const VERSION = "v0";

const abi = { v0: implementationAbi };

const abiByFunctionNames = {};
_.map(abi, (value, key) => {
  abiByFunctionNames[key] = _.mapKeys(abi[key],"name");
});

console.log(abiByFunctionNames);

module.exports = {
  implementationAddress: implementationAddress,

  implementationAbi: implementationContract.abi,

  encodedFunctionCall: (name, inputs) => {
    return web3.eth.abi.encodeFunctionCall(abiByFunctionNames[VERSION][name], inputs);
  },

  encodedFunctionSignature: (name) => {
    return web3.eth.abi.encodeFunctionSignature(abiByFunctionNames[VERSION][name]);
  },

  encodedEventSignature: (name) => {
    return web3.eth.abi.encodeEventSignature(abiByFunctionNames[VERSION][name]);
  }
}
