const Web3 = require('web3-v1');

var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

// web3.eth.getAccounts().then(result => {console.log('ACCOUNT- 0:',result[0]);}).catch(error => {console.log(error)});

//web3.eth.getAccounts().catch(error => console.log(error));

module.exports = web3;
