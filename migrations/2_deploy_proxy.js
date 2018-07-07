//var Players = artifacts.require("./Players.sol");
var OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy.sol");

module.exports = function(deployer) {
  //deployer.deploy(Players);
  deployer.deploy(OwnedUpgradeabilityProxy);
};
