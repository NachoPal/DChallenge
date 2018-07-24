module.exports = function(callback) {
  const web3 = require('../src/initializers/web3.js');
  const proxy = require('../src/initializers/proxy_info.js');
  const proxyOptions = proxy.proxyOptions;
  const proxyAbi = proxy.proxyAbi;
  const proxyContract = proxy.proxyContract;
  const encodedFunctionCall = require("../src/helpers/helper_web3").encodedFunctionCall;
  const implementation = require('../src/initializers/implementation_info.js');
  const implementationAddress = implementation.implementationAddress;
  const implementationAbi = implementation.implementationAbi;

  const challengeInputs = (index) => {
    return {
      title: web3.utils.asciiToHex(`My challenge #${index}`),
      description: web3.utils.randomHex(32),
      thumbnail: web3.utils.randomHex(32),
      openTime: Math.floor(Date.now() + (50000 * index)),
      closeTime: Math.floor(Date.now() + (500000 * index * 2)),
      bettingPrice: 100
    }
  }

  const initializeInputs = {
    timeDelay: 300,
    secondsPerBlock: 15
  }

  web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[0];

    proxyContract.deployed().then((instance) => {
      instance.implementation().then( result => {
          //if(result == '0x0000000000000000000000000000000000000000') {
            console.log("Implementatio Address", implementationAddress);
            console.log("Data",encodedFunctionCall("initialize", Object.values(initializeInputs), implementationAbi));
            instance.upgradeToAndCall(
              implementationAddress,
              encodedFunctionCall("initialize", Object.values(initializeInputs), implementationAbi),
              {from: web3.eth.defaultAccount, gas: 3000000}
            )
            .then((result) => {
              console.log("Data init",encodedFunctionCall("initialize", Object.values(initializeInputs), implementationAbi));
              for (var i = 1; i <= 5; i++) {
                console.log("Data participate", proxyOptions("createChallenge", challengeInputs(i)));
                web3.eth.sendTransaction(proxyOptions("createChallenge", challengeInputs(i)))
                .on('receipt', (recepit) => {
                  console.log(recepit);
                })
                .on('error', (error) => console.log(error))
              }
            })
            .catch((error) => {console.log(error)});
          //}
      })
      console.log("Popupation success")
    })
  });
}
