//var Players = artifacts.require("./Players.sol");
var DChallenge = artifacts.require(".DChallenge.sol");

module.exports = function(deployer) {
  //deployer.deploy(Players);
  deployer.deploy(DChallenge);
};
