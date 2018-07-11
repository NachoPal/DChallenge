const Web3 = require('web3-v1');

var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

module.exports = web3;
