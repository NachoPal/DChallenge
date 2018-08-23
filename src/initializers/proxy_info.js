const _ =  require('lodash');
const artifact = require('../../build/contracts/OwnedUpgradeabilityProxy.json');
const contract = require("truffle-contract");
const web3 = require('./web3.js');
const web3meta = require('./web3_metamask.js');
const encodedFunctionCall = require('../helpers/helper_web3.js').encodedFunctionCall;
const implementation = require('./implementation_info.js');
const implementationAbi = implementation.implementationAbi;

//#DEVELOPMENT
const networks_id = _.keys(artifact.networks);
const id = networks_id[networks_id.length-1];
const address = artifact.networks[id].address;
const abi = artifact.abi;

//#RINKEBY
// const id = 4;
// const address = artifact.networks[id].address;
// const abi = artifact.abi;

var Contract = contract(artifact);
Contract.setProvider(web3.currentProvider);
Contract.currentProvider.sendAsync = function () {
  return Contract.currentProvider.send.apply(Contract.currentProvider, arguments);
};

// const address = Contract.deployed().then(instance => {return instance.address});
// const abi = Contract.deployed().then(instance => {return instance.abi});


module.exports = {
  networkID: id,
  proxyAddress: address,
  proxyAbi: abi,
  proxyArtifact: artifact,
  proxyContract: Contract,
  proxyOptions: (functionName, inputs, value, from) => {
    const dataObject = {
      to: address,
      value: value,
      gas: 6654755,
      data: encodedFunctionCall(functionName, Object.values(inputs), implementationAbi)
    }

    if(from == true) {
      dataObject["from"] = web3.eth.defaultAccount;
    }

    return dataObject;
  }
}
