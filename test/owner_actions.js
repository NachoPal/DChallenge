const web3 = require('../src/initializers/web3.js');
const encodedFunctionCall = require('../src/helpers/helper_web3').encodedFunctionCall;
const encodedEventSignature = require('../src/helpers/helper_web3').encodedEventSignature;
const getAbiByFunctionNames = require('../src/helpers/helper_web3').getAbiByFunctionNames;
const decodeParameters = require('../src/helpers/helper_web3').decodeParameters;

var OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy");
var DChallenge = artifacts.require("./DChallenge");

contract('OwnerActions', function(accounts) {

  before("Initialize Implementation (DChallenge contract) and make Proxy to point to it", async () => {
    this.initializeInputs = {
      submitDelay: 300,
      txDelay: 15,
      secondsPerBlock: 15
    }

    this.ownerAccount = accounts[1];

    this.proxy = await OwnedUpgradeabilityProxy.deployed();
    this.implementation = await DChallenge.deployed();

    this.proxyAddress = proxy.address;
    this.proxyAbi = proxy.abi;
    this.proxyBalance = await web3.eth.getBalance(this.proxyAddress);
    this.implementationAddress = implementation.address;
    this.implementationAbi = implementation.abi;


    await this.proxy.upgradeToAndCall(
      this.implementationAddress,
      encodedFunctionCall("initialize", Object.values(this.initializeInputs), this.implementationAbi),
      {from: this.ownerAccount, gas: 3000000}
    );
  });

  it("Proxy contract points out to Implementation", async () => {
    // const proxy = await OwnedUpgradeabilityProxy.deployed();
    // const implementation = await DChallenge.deployed();

    const expectedImplementationAddress = this.implementationAddress;
    const implementationAddress = await proxy.implementation();

    assert.equal(
      implementationAddress,
      expectedImplementationAddress,
      "Proxy wasn't initialize properly"
    );
  });

  it("Implementation is initialized properly", async () => {
    const submitDelay = await web3.eth.call(
      {
        from: accounts[0],
        to: this.proxyAddress,
        data: encodedFunctionCall("submitDelay", {}, this.implementationAbi)
      }
    );

    const txDelay = await web3.eth.call(
      {
        from: accounts[0],
        to: this.proxyAddress,
        data: encodedFunctionCall("txDelay", {}, this.implementationAbi)
      }
    );

    const secondsPerBlock = await web3.eth.call(
      {
        from: accounts[0],
        to: this.proxyAddress,
        data: encodedFunctionCall("secondsPerBlock", {}, this.implementationAbi)
      }
    );

    const expectedInitializedStorage = this.initializeInputs;

    const initializedStorage = {
      submitDelay: web3.utils.hexToNumber(submitDelay),
      txDelay: web3.utils.hexToNumber(txDelay),
      secondsPerBlock: web3.utils.hexToNumber(secondsPerBlock)
    }

    assert.deepEqual(
      initializedStorage,
      expectedInitializedStorage,
      "Implementation wasn't initialize properly"
    );
  });

  it("Owner creates a challenge", async () => {
    const openTime = Math.floor((Date.now() + (60 * 1000)));
    const closeTime = Math.floor((Date.now() + (120 * 1000)));

    const expectedChallengeInputs = {
        title: web3.utils.padRight(web3.utils.asciiToHex("Test challenge"), 64),
        summary: "QmUmZGpo44wnBhauUEa9uMTWLCTswJm4RE9uxkCoYMCgTa",
        description: "QmY26Pa9cKqyY8FJbq7KSz7NYumkBmf5odYsLxC72ZQxHv",
        thumbnail: "QmeEuzAxrQB9ueXRb9QX9UUzUZMDB9EKeWoKdDFn1KsTQk",
        openTime: openTime,
        closeTime: closeTime,
        bettingPrice: 100000000000000000
      }

    await web3.eth.sendTransaction({
      data: encodedFunctionCall(
        "createChallenge",
        Object.values(expectedChallengeInputs),
        this.implementationAbi
      ),
      from: this.ownerAccount,
      to: this.proxyAddress,
      gas: 3000000
    });

    const challengeId = await web3.eth.call({
      data: encodedFunctionCall("challengesCounter", {}, this.implementationAbi),
      from: this.ownerAccount,
      to: this.proxyAddress
    });

    console.log("Challenges Counter", challengeId);

    var challengeData = await web3.eth.call({
      data: encodedFunctionCall(
        "challenges",
        challengeId,
        this.implementationAbi
      ),
      from: this.ownerAccount,
      to: this.proxyAddress,
    });

    challengeData = decodeParameters("challenges", this.implementationAbi, challengeData)

    const logs = await web3.eth.getPastLogs({
      fromBlock: 1,
      address: this.proxyAddress,
      topics: [encodedEventSignature("challengeCreation", this.implementationAbi)]
    });

    const decodedLogs = web3.eth.abi.decodeLog(
      getAbiByFunctionNames(this.implementationAbi)["challengeCreation"].inputs,
      logs[0].data,
      _.drop(logs[0].topics)
    );

    var challengeInputs = {};
    challengeInputs["title"] = decodedLogs.title;
    challengeInputs["summary"] = decodedLogs.summary;
    challengeInputs["description"] = decodedLogs.description;
    challengeInputs["thumbnail"] = decodedLogs.thumbnail;
    challengeInputs["openTime"] = parseInt(challengeData.openTime);
    challengeInputs["closeTime"] = parseInt(challengeData.closeTime);
    challengeInputs["bettingPrice"] = parseInt(challengeData.bettingPrice);

    assert.deepEqual(
      challengeInputs,
      expectedChallengeInputs,
      "Challenge wasn't created properly"
    )
  });

  // it("Owner upgrade the Implementation address", async () => {
  //   const currentOwner = await this.proxy.proxyOwner();
  //
  //   const expectedImplementationAddress = web3.utils.randomHex(20);
  //   await this.proxy.upgradeTo(expectedImplementationAddress, {from: currentOwner});
  //
  //   const implementationAddress = await this.proxy.implementation();
  //
  //   assert.equal(
  //     implementationAddress,
  //     expectedImplementationAddress,
  //     "Implementation wasn't upgraded properly"
  //   );
  // });
  //
  // it("Owner transfer proxy ownership", async () => {
  //   const currentOwner = await this.proxy.proxyOwner();
  //   const expectedNewOwner = accounts[0];
  //
  //   await this.proxy.transferProxyOwnership(expectedNewOwner, {from: currentOwner});
  //   const newOwner = await this.proxy.proxyOwner();
  //
  //   assert.equal(newOwner, expectedNewOwner, "Ownership wasn't transfered properly");
  // });

  it("Owner kill the Proxy contract is refunded with its balance", async () => {
    const currentOwnerBalance = await web3.eth.getBalance(this.ownerAccount);

    const recepit = await web3.eth.sendTransaction({
      data: encodedFunctionCall("kill", {}, this.implementationAbi),
      from: this.ownerAccount,
      to: this.proxyAddress,
      gas: 3000000,
      gasPrice: 10000000000
    });

    const transactionCost = recepit.gasUsed * 10000000000;
    const expectedOwnerBalance = parseInt(currentOwnerBalance) - transactionCost + parseInt(this.proxyBalance);
    const ownerBalance = await web3.eth.getBalance(this.ownerAccount);

    assert.equal(ownerBalance, expectedOwnerBalance, "Contract wasn't killed properly");
  });

});
