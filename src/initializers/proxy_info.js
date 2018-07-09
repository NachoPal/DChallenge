const _ =  require('lodash');
const proxyContract = require('../../build/contracts/OwnedUpgradeabilityProxy.json');

const networks_id = _.keys(proxyContract.networks);
const id = networks_id[networks_id.length-1];

module.exports = {
  proxyAddress: proxyContract.networks[id].address,
  proxyAbi: proxyContract.abi,
  proxyArtifact: proxyContract
}
