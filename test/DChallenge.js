const web3 = require('../src/initializers/web3.js');
const encodedFunctionCall = require('../src/helpers/helper_web3').encodedFunctionCall;
const encodedEventSignature = require('../src/helpers/helper_web3').encodedEventSignature;
const getAbiByFunctionNames = require('../src/helpers/helper_web3').getAbiByFunctionNames;
const decodeParameters = require('../src/helpers/helper_web3').decodeParameters;
const numberTo32bytes = require('../src/helpers/helper_web3').numberTo32bytes;

var OwnedUpgradeabilityProxy = artifacts.require("./OwnedUpgradeabilityProxy");
var DChallenge = artifacts.require("./DChallenge");

contract('DChallenge', function(accounts) {

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

    this.initialUserBalance = await web3.eth.call({
      data: encodedFunctionCall("balances", [accounts[0]], this.implementationAbi),
      from: accounts[0],
      to: this.proxyAddress
    });

    this.timeTravel = function(time) {
      return new Promise((resolve, reject) => {
          web3.currentProvider.send({
          jsonrpc: "2.0",
          method: "evm_increaseTime",
          params: [time], // 86400 is num seconds in day
          id: new Date().getSeconds()
        }, (err, result) => {
          if(err){ return reject(err) }
          return resolve(result)
        });
      });
    };

    this.waitForOraclizeTx = function() {
      return new Promise( resolve => {
        setTimeout(() => { return resolve() }, (this.closePeriod + this.delay) * 1000);
      });
    };
  });

  it("Owner creates a challenge", async () =>{
    this.openPeriod = 15;
    this.closePeriod = 30;
    this.delay = 30;
    this.bettingPrice = 100000000000000000;

    const openTime = Math.floor((Date.now()/1000) + this.openPeriod);
    const closeTime = Math.floor((Date.now()/1000) + this.closePeriod);

    const expectedChallengeInputs = {
        title: web3.utils.padRight(web3.utils.asciiToHex("Test challenge"), 64),
        summary: "QmUmZGpo44wnBhauUEa9uMTWLCTswJm4RE9uxkCoYMCgTa",
        description: "QmY26Pa9cKqyY8FJbq7KSz7NYumkBmf5odYsLxC72ZQxHv",
        thumbnail: "QmeEuzAxrQB9ueXRb9QX9UUzUZMDB9EKeWoKdDFn1KsTQk",
        openTime: openTime,
        closeTime: closeTime,
        bettingPrice: this.bettingPrice
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

    this.challengeCounter = await web3.eth.call({
      data: encodedFunctionCall("challengesCounter", {}, this.implementationAbi),
      from: this.ownerAccount,
      to: this.proxyAddress
    });

    this.challengeId = web3.utils.hexToNumber(this.challengeCounter) - 1;

    this.bettingPrice = 100000000000000000;

    var challengeData = await web3.eth.call({
      data: encodedFunctionCall(
        "challenges",
        [this.challengeId],
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

  it("User participate in the challenge", async () => {
    const expectedParticipateInputs = {
      id: this.challengeId,
      userAddress: accounts[0]
    }

    await web3.eth.sendTransaction({
      data: encodedFunctionCall(
        "participate",
        Object.values(expectedParticipateInputs),
        this.implementationAbi
      ),
      from: accounts[0],
      to: this.proxyAddress,
      value: this.bettingPrice,
      gas: 3000000
    });

    var challengeData = await web3.eth.call({
      data: encodedFunctionCall(
        "challenges",
        [this.challengeId],
        this.implementationAbi
      ),
      from: this.ownerAccount,
      to: this.proxyAddress,
    });

    challengeData = decodeParameters("challenges", this.implementationAbi, challengeData);

    var isParticipating = await web3.eth.call({
      data: encodedFunctionCall(
        "userIsParticipating",
        Object.values(expectedParticipateInputs),
        this.implementationAbi
      ),
      from: this.ownerAccount,
      to: this.proxyAddress,
    });

    isParticipating = decodeParameters("userIsParticipating", this.implementationAbi, isParticipating);

    const expectedValues = {
      isParticipating: true,
      participants: 1
    }

    const values = {
      isParticipating: isParticipating[0],
      participants: parseInt(challengeData.participantsCounter)
    }

    assert.deepEqual(values, expectedValues, "User couldn't participate in the challenge");

    const logs = await web3.eth.getPastLogs({
      fromBlock: 1,
      address: this.proxyAddress,
      topics: [
        encodedEventSignature("challengeParticipation", this.implementationAbi),
        numberTo32bytes(this.challengeId)
      ]
    })

    const decodedLogs = web3.eth.abi.decodeLog(
      getAbiByFunctionNames(this.implementationAbi)["challengeParticipation"].inputs,
      logs[0].data,
      _.drop(logs[0].topics)
    );

    participateInputs = {};
    participateInputs["id"] = parseInt(decodedLogs.id);
    participateInputs["userAddress"] = decodedLogs.userAddress.toLowerCase();

    assert.deepEqual(participateInputs, expectedParticipateInputs, "User couldn't participate in the challenge")
  });

  it("User submit a video in a challenge", async () => {
    await this.timeTravel(this.openPeriod);

    const confirmedBlock = await web3.eth.getBlockNumber();
    const block = await web3.eth.getBlock(confirmedBlock);

    var expectedSubmitInputs = {
      id: this.challengeId,
      confirmedBlock: confirmedBlock,
      code: web3.utils.soliditySha3(accounts[0], block.hash),
      videoDuration: 60,
      ipfsHash: "QmUmZGpo44wnBhauUEa9uMTWLCTswJm4RE9uxkCoYMCgTa",
      userAddress: accounts[0]
    }

    await web3.eth.sendTransaction({
      data: encodedFunctionCall(
        "submit",
        Object.values(expectedSubmitInputs),
        this.implementationAbi
      ),
      from: accounts[0],
      to: this.proxyAddress,
      gas: 3000000
    });

    var hasSubmitted = await web3.eth.call({
      data: encodedFunctionCall(
        "userHasSubmitted",
        Object.values({id: this.challengeId, userAddress: accounts[0]}),
        this.implementationAbi
      ),
      from: this.ownerAccount,
      to: this.proxyAddress,
    });

    hasSubmitted = decodeParameters("userHasSubmitted", this.implementationAbi, hasSubmitted);

    assert.equal(hasSubmitted[0], true, "User couldn't participate in the challenge");

    const logs = await web3.eth.getPastLogs({
      fromBlock: 1,
      address: this.proxyAddress,
      topics: [
        encodedEventSignature("challengeSubmission", this.implementationAbi),
        numberTo32bytes(this.challengeId)
      ]
    })

    const decodedLogs = web3.eth.abi.decodeLog(
      getAbiByFunctionNames(this.implementationAbi)["challengeSubmission"].inputs,
      logs[0].data,
      _.drop(logs[0].topics)
    );

    delete expectedSubmitInputs.confirmedBlock;

    var submitInputs = {};
    submitInputs["id"] = parseInt(decodedLogs.id);
    submitInputs["userAddress"] = (decodedLogs.userAddress).toLowerCase();
    submitInputs["code"] = decodedLogs.code;
    submitInputs["videoDuration"] = parseInt(decodedLogs.videoDuration);
    submitInputs["ipfsHash"] = decodedLogs.ipfsHash;

    assert.deepEqual(
      submitInputs,
      expectedSubmitInputs,
      "Video wasn't submitted properly"
    )
  });

  it("Oraclize closes the challenge and a winner is selected", async () => {
    console.log("Waiting " + (this.closePeriod + this.delay) + " seconds for Oraclize to close the challenge");
    await this.waitForOraclizeTx();

    const expectedClosedValues = {
      id: this.challengeId,
      winner: true,
      winnerAddress: accounts[0],
      prizeAmount: this.bettingPrice
    }

    const logs = await web3.eth.getPastLogs({
      fromBlock: 1,
      address: this.proxyAddress,
      topics: [encodedEventSignature("challengeClosed", this.implementationAbi)]
    })

    const decodedLogs = web3.eth.abi.decodeLog(
      getAbiByFunctionNames(this.implementationAbi)["challengeClosed"].inputs,
      logs[0].data,
      _.drop(logs[0].topics)
    );

    closedValues = {};
    closedValues["id"] = parseInt(decodedLogs.id);
    closedValues["winner"] = decodedLogs.winner;
    closedValues["winnerAddress"] = decodedLogs.winnerAddress;
    closedValues["prizeAmount"] = decodedLogs.prizeAmount;

    assert(closedValues, expectedClosedValues, "Challenge wasn't closed properly");

    const finalUserBalance = await web3.eth.call({
      data: encodedFunctionCall("balances", [closedValues.winnerAddress], this.implementationAbi),
      from: accounts[0],
      to: this.proxyAddress
    });

    assert(finalUserBalance, this.initialUserBalance + this.bettingPrice, "Prize wasn't assigned properly")
  });

  it("User withdraw his balance", async () => {
    const withdrawalInputs = {
      amount: this.bettingPrice,
      userAdress: accounts[0]
    }

    const initialAccountBalance = await web3.eth.getBalance(accounts[0]);

    const receipt = await web3.eth.sendTransaction({
      data: encodedFunctionCall(
        "userWithdraw",
        Object.values(withdrawalInputs),
        this.implementationAbi
      ),
      from: accounts[0],
      to: this.proxyAddress,
      gas: 3000000,
      gasPrice: 10000000000
    });

    const transactionCost = receipt.gasUsed * 10000000000;
    const expectedFinalAccountBalance = parseInt(initialAccountBalance) - transactionCost + this.bettingPrice;

    const finalAccountBalance = await web3.eth.getBalance(accounts[0]);

    assert.equal(finalAccountBalance, expectedFinalAccountBalance, "The user didn't withdraw the prize properly")
  });
});
