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
      summary: "QmUmZGpo44wnBhauUEa9uMTWLCTswJm4RE9uxkCoYMCgTa",
      description: "QmY26Pa9cKqyY8FJbq7KSz7NYumkBmf5odYsLxC72ZQxHv",
      thumbnail: "QmeEuzAxrQB9ueXRb9QX9UUzUZMDB9EKeWoKdDFn1KsTQk",
      openTime: Math.floor((Date.now() + (openTime * 1000))),
      closeTime: Math.floor((Date.now() + (closeTime * 1000))),
      bettingPrice: 100000000000000000
    }

  web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[1];
    web3.eth.sendTransaction(proxyOptions("createChallenge", challengeInputs, 0))
    .on('receipt', (recepit) => {
      console.log("SUCCESS CHALLENGE CREATION",recepit.transactionHash);
    })
    .on('error', (error) => console.log(error));
  });
}
