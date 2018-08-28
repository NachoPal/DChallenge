var OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy.sol");

module.exports = function(deployer) {
  deployer.deploy(
    OwnedUpgradeabilityProxy,
    {value: 100000000000000000}
  );
};
