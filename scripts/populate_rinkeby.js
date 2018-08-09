// const web3 = require('../src/initializers/web3.js');
// const proxy = require('../src/initializers/proxy_info.js');
// const proxyAbi = proxy.proxyAbi;
// const proxyAddress = proxy.proxyAddess;
//
// function MyContractSetup (abi, address) {
//   let MyContractABI = web3.eth.contract(PROVIDED_CONTRACT_ABI)
//   let MyContractObj = MyContractABI.at(DEPLOYED_CONTRACT_ADDRESS_LOCATION)
//   return MyContractObj
// }
// const proxy = MyContractSetup(proxyAbi, proxyAddess);

module.exports = function(callback) {
  // require('babel-register')({
  //  presets: [ 'es2015' ]
  // });
  // require("./app.js6");
  console.log("Entea");
  const web3 = require('../src/initializers/web3.js');

  web3.eth.net.isListening().then( () => {

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
        summary: "QmUmZGpo44wnBhauUEa9uMTWLCTswJm4RE9uxkCoYMCgTa",
        description: "QmY26Pa9cKqyY8FJbq7KSz7NYumkBmf5odYsLxC72ZQxHv",
        thumbnail: "QmeEuzAxrQB9ueXRb9QX9UUzUZMDB9EKeWoKdDFn1KsTQk",
        openTime: Math.floor((Date.now()/1000) + (index * 180)),
        closeTime: Math.floor((Date.now()/1000) + (index * 300)),
        bettingPrice: 100000000000000000
      }
    }

    const initializeInputs = {
      submitDelay: 300,
      txDelay: 15,
      secondsPerBlock: 15
    }

    //web3.eth.defaultAccount = "0xf022797e23c6683b17bd2fe5e1b75250fdc851e4";

    proxyContract.deployed().then((instance) => {
      instance.implementation().then( result => {
          //if(result == '0x0000000000000000000000000000000000000000') {
            instance.upgradeToAndCall(
              implementationAddress,
              encodedFunctionCall("initialize", Object.values(initializeInputs), implementationAbi),
              {from: web3.eth.defaultAccount, gas: 3000000}
            )
            .then((result) => {
              for (var i = 1; i <= 5; i++) {
                web3.eth.sendTransaction(proxyOptions("createChallenge", challengeInputs(i), 0))
                .on('receipt', (recepit) => {
                  console.log("SUCCESS CHALLENGE CREATION",recepit.transactionHash);
                })
                .on('error', (error) => console.log("ERROR CHALLENGE CREATION"))
              }
            })
            .catch((error) => {console.log("ERROR UPGRATE TO AND CALL", error)});
          //}
      })
    })
  });

  //web3.eth.getAccounts().then((accounts) => {

  //});
}
