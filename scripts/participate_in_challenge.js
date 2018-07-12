module.exports = function(callback) {
  require('process');
  const web3 = require('../src/initializers/web3.js');
  const proxy = require('../src/initializers/proxy_info.js');
  const proxyOptions = proxy.proxyOptions;

  const participateInputs = {
    challengeId: parseInt(process.argv[4])
  }

  web3.eth.getAccounts().then((accounts) => {
    web3.eth.defaultAccount = accounts[0];
    web3.eth.sendTransaction(proxyOptions("participate", participateInputs))
    .on('receipt', (recepit) => {
      console.log(recepit.logs[0].topics);
      console.log("Participation success");
    })
    .on('error', (error) => console.log(error));
  });
}
