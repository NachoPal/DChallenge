//import Web3 from 'web3-v1';
//import { web3 } from '../src/initializers/web3';
module.exports = function(callback) {
  //export const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
  const contract = require("truffle-contract");
  const web3 = require('../src/initializers/web3.js');
  const proxy = require('../src/initializers/proxy_info.js');
  const proxyAbi = proxy.proxyAbi;
  const proxyAddress = proxy.proxyAddress;
  const proxyArtifact = proxy.proxyArtifact;
  const implementation = require('../src/initializers/implementation_info.js');
  const implementationAddress = implementation.implementationAddress;
  const encodedFunctionCall = require('../src/initializers/implementation_info.js').encodedFunctionCall;



  var ProxyContract = contract(proxyArtifact);

  ProxyContract.setProvider(web3.currentProvider);

  ProxyContract.currentProvider.sendAsync = function () {
    return ProxyContract.currentProvider.send.apply(ProxyContract.currentProvider, arguments);
  };

  const challengeInputs = {
    title: web3.utils.asciiToHex("Mi primer challenge"),
    description: web3.utils.randomHex(32),
    thumbnail: web3.utils.randomHex(32),
    openTime: Math.floor((Date.now() + 28800000)/1000),
    closeTime: Math.floor((Date.now() + 28800000 * 2)/1000)
  }

  console.log(challengeInputs);

  web3.eth.defaultAccount = "0x67cc399bc267a2604a383397502754a346e2a9fd";

  const proxyOptions = {
    //from: web3.eth.defaultAccount,
    from: web3.eth.defaultAccount,
    to: proxyAddress,
    gas: 3000000,
    data: encodedFunctionCall("createChallenge", Object.values(challengeInputs))
  }

  //ProxyContract.deployed().catch(error => {console.log(error)});
  console.log(encodedFunctionCall("createChallenge", Object.values(challengeInputs)));

  ProxyContract.deployed().then((instance) => {
    instance.upgradeTo(implementationAddress, {from: proxyOptions.from})
    .then((result) => {
      web3.eth.sendTransaction(proxyOptions)
      .on('recepit', (recepit) => console.log(recepit))
      .on('error', (error) => console.log(error))
    })
    .catch((error) => {console.log(error)});
  });
}
