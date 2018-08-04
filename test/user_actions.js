const web3 = require('../src/initializers/web3.js');
const encodedFunctionCall = require('../src/helpers/helper_web3').encodedFunctionCall;
const encodedEventSignature = require('../src/helpers/helper_web3').encodedEventSignature;
const getAbiByFunctionNames = require('../src/helpers/helper_web3').getAbiByFunctionNames;
const decodeParameters = require('../src/helpers/helper_web3').decodeParameters;

var OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy");
var DChallenge = artifacts.require("./DChallenge");

contract('UserActions', function(accounts) {

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

  before("Owner creates a challenge", async () =>{
    const openTime = Math.floor((Date.now() + (600 * 1000)));
    const closeTime = Math.floor((Date.now() + (1200 * 1000)));

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

    this.challengeId = await web3.eth.call({
      data: encodedFunctionCall("challengesCounter", {}, this.implementationAbi),
      from: this.ownerAccount,
      to: this.proxyAddress
    });

    this.bettingPrice = 100000000000000000;
  });

  it("User participate in the challenge", async () => {
    const participateInputs = {
      challengeId: this.challengeId,
      userAddress: accounts[0]
    }

    await web3.eth.sendTransaction({
      data: encodedFunctionCall(
        "participate",
        Object.values(participateInputs),
        this.implementationAbi
      ),
      from: accounts[0],
      to: this.proxyAddress,
      value: this.bettingPrice,
      gas: 3000000
    });

    const challenge = await web3.eth.call({
      data: encodedFunctionCall(
        "challenges",
        parseInt(this.challengeId),
        this.implementationAbi
      )
    });

    console.log(challenge);

    const isParticipating = await web3.eth.call({
      data: encodedFunctionCall(
        "isParticipating",
        parseInt(this.challengeId),
        this.implementationAbi
      )
    });

    // const expectedValues = {
    //   isParticipating: true,
    //   participants: 1
    // }
    //
    // const values = {
    //   isParticipating: isParticipating,
    //   participants: challenge
    // }




  });
});
