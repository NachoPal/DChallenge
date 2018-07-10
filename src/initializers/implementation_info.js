const web3 = require('./web3.js');
const _ =  require('lodash');
const artifact = require('../../build/contracts/DChallenge.json')

const networks_id = _.keys(artifact.networks);
const id = networks_id[networks_id.length-1];

const address = artifact.networks[id].address;
var abi = artifact.abi;

module.exports = {
  implementationAddress: address,
  implementationAbi: abi,
}
