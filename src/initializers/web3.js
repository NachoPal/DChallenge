const Web3 = require('web3-v1');
// const INFURA_API_KEY = "fe8906a37fee49cabcce37e2aa3a36a9";
// var HDWalletProvider = require("truffle-hdwallet-provider");
// var mnemonic = "above decline twin original artefact debate fade duck fossil enact sorry there";

//#Development
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

//#Rinkeby
//var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));

module.exports = web3;
