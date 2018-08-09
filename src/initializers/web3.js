const Web3 = require('web3-v1');
// const INFURA_API_KEY = "fe8906a37fee49cabcce37e2aa3a36a9";
// var HDWalletProvider = require("truffle-hdwallet-provider");
// var mnemonic = "above decline twin original artefact debate fade duck fossil enact sorry there";

//Development
var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));

//Rinkeby
// const provider = new HDWalletProvider(
//     mnemonic,
//     walletAPIUrl
// );

////var web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));


//var web3 = new Web3(new Web3.providers.HttpProvider(`https://rinkeby.infura.io/${INFURA_API_KEY}`));

// const privateKey = '7C390FA523377CE4880B178F16E1DB2EEF98FF1708BA94CDB9E17E951F1F7A04';
// const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
// web3.eth.accounts.wallet.add(account);
// web3.eth.personal.unlockAccount(account.address,"");
// web3.eth.defaultAccount = account.address;


// web3.eth.net.isListening()
//    .then(() => console.log('is connected'))
//    .catch(e => console.log('Wow. Something went wrong'));

module.exports = web3;
