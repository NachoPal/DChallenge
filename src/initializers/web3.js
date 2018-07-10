const Web3 = require('web3-v1');

var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

web3.eth.defaultAccount = "0x2a9a526b6f53399e4e5da57c49afb013a80ce6bf";

module.exports = web3;
