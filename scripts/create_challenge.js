module.exports = function(callback) {
  require('process');
  const web3 = require('../src/initializers/web3.js');
  const proxy = require('../src/initializers/proxy_info.js');
  const proxyOptions = proxy.proxyOptions;

  const title = process.argv[4];
  const openTime = parseInt(process.argv[5]);
  const closeTime = parseInt(process.argv[6]);
  const challengeInputs = {
      title: web3.utils.asciiToHex(title),
      description: web3.utils.randomHex(32),
      thumbnail: web3.utils.randomHex(32),
      openTime: Math.floor((Date.now() + (openTime * 1000))),
      closeTime: Math.floor((Date.now() + (closeTime * 1000))),
      bettingPrice: 100
    }

  web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[0];
    web3.eth.sendTransaction(proxyOptions("createChallenge", challengeInputs))
    .on('receipt', (recepit) => {
      console.log(recepit);
      console.log("Created challenge");
    })
    .on('error', (error) => console.log(error));
  });
}
