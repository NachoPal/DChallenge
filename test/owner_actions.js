const web3 = require('../src/initializers/web3.js');
const encodedFunctionCall = require("../src/helpers/helper_web3").encodedFunctionCall;
// const implementation = require('../src/initializers/implementation_info.js');
// const implementationAddress = implementation.implementationAddress;
// const implementationAbi = implementation.implementationAbi;

var OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy");
var DChallenge = artifacts.require("./DChallenge");

contract('OwnerActions', function(accounts) {

  before("Initialize Implementation (DChallenge contract) and make Proxy to point to it", async () => {
    const initializeInputs = {
      submitDelay: 300,
      txDelay: 15,
      secondsPerBlock: 15
    }

    const proxy = await OwnedUpgradeabilityProxy.deployed();
    const implementation = await DChallenge.deployed();

    const implementationAddress = implementation.address;
    const implementationAbi = implementation.abi;

    await proxy.upgradeToAndCall(
      implementationAddress,
      encodedFunctionCall("initialize", Object.values(initializeInputs), implementationAbi),
      {from: accounts[1], gas: 3000000}
    );
  });

  it("Proxy contract points to Implementation", async () => {
    const proxy = await OwnedUpgradeabilityProxy.deployed();
    const implementation = await DChallenge.deployed();

    const expectedImplementationAddress = implementation.address;
    const implementationAddress = await proxy.implementation();

    assert.equal(
      implementationAddress,
      expectedImplementationAddress,
      "Proxy wasn't initialize properly"
    );
  });

});
