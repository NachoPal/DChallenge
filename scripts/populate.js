module.exports = function(callback) {
  const web3 = require('../src/initializers/web3.js');
  const proxy = require('../src/initializers/proxy_info.js');
  const proxyOptions = proxy.proxyOptions;
  const proxyContract = proxy.proxyContract;
  const implementation = require('../src/initializers/implementation_info.js');
  const implementationAddress = implementation.implementationAddress;



  const challengeInputs = (index) => {
    return {
      title: web3.utils.asciiToHex(`My challenge #${index}`),
      description: web3.utils.randomHex(32),
      thumbnail: web3.utils.randomHex(32),
      openTime: Math.floor((Date.now() + 28800000)/1000),
      closeTime: Math.floor((Date.now() + (28800000 * index))/1000)
    }
  }

  web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[0];

    proxyContract.deployed().then((instance) => {
      instance.implementation().then( result => {
          if(result == '0x0000000000000000000000000000000000000000') {
            instance.upgradeTo(implementationAddress, {from: web3.eth.defaultAccount})
            .then((result) => {
              for (var i = 0; i < 5; i++) {
                web3.eth.sendTransaction(proxyOptions("createChallenge", challengeInputs(i)))
                .on('receipt', (recepit) => {
                  console.log(recepit);
                })
                .on('error', (error) => console.log(error))
              }
            })
            .catch((error) => {console.log(error)});
          }
      })
      console.log("Popupation success")
    })
  });
}
