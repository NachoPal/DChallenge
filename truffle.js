var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "above decline twin original artefact debate fade duck fossil enact sorry there";
const Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const INFURA_API_KEY = "fe8906a37fee49cabcce37e2aa3a36a9";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      //gas: 4500000,
      gas: 6721975,
      gasPrice: 10000000000,
      //from: web3.eth.accounts[1]
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`)
      },
      gas: 6721975,
      gasPrice: 10000000000,
      network_id: 4
    }
  }
};
