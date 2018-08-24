# What my project does?

# How to set it up
I created **two different branches** since there are some front-end code differences depending on what **Web3 provider** is used. In `development` branch the provider is `ganache-cli`, whereas in `rinkeby` it is the testnet Rinkeby via `infura`. Branch `master` is up to date with `rinkeby`, however it will be used in the future as **production branch** for the `mainnet`.

In addition, **signing transactions with uPort is not possible using a local RPC testnet** since there is no way for uPort servers to interact with the deployed contracts in the local network. There are only two possible options to be able to sign transactions with uPort, either to deploy the smart contracts to a testnet such as Rinkeby, or to set up a local private network with a JSON RPC public endpoint making use of [lambda-olorum](https://github.com/uport-project/lambda-olorun). For the sake of simplicity for evaluators, I decided not to set up a local private network run by a Geth node.

In regard Contracts code, there is an inevitable difference depending on the provider. For using Oraclize in a local RPC testnet it is necessary to hardcode in the contract constructor the OAR (Oraclize Address Resolver) address provided by [ethereum-bridge](https://github.com/oraclize/ethereum-bridge). Contracts from both branches are exactly the same with the exception of the following line in the constructor for the `development` branch: `OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);`. Therefore, passing tests in `development` ensures successful testing in `rinkeby` branch as well.

To summarize, `development` branch will be use to **run the tests** against `ganache-cli`, whereas `rinkeby` will be used to **interact with the front-end** being able in this way to sign transactions with **uPort**.

Because of **uPort** having a dependency on **web3 v0.19** I needed to install **web3 v1.0.0** under other name to avoid conflicts and be able to use **Web Sockets**. To make it possible I made use of the package `npm-install-version`.

## Requirements
  * Ubuntu 16.04
  * Nodejs 10.9.0
  * Truffle 4.1.13
  * Ganache-cli 6.1.6

## Steps (in order)
  * Install the last version of **Nodejs**:

    `$ sudo apt-get install -y nodejs`
  * Install **git**:

    `$ sudo apt install git`
  * Create a new folder for **development git branch** and change to it:

    `$ mkdir Development`

    `$ cd Development`
  * Clone `development` branch from the repository:

    `$ git clone -b development https://github.com/NachoPal/DChallenge`
  * Create a new folder for **rinkeby git branch** and change to it:

    `$ cd ..`

    `$ mkdir Rinkeby`

    `$ cd Rinkeby`
  * Clone `rinkeby` branch from the repository:

    `$ git clone -b rinkeby https://github.com/NachoPal/DChallenge`    
  * Install **Truffle** globally:

    `$ sudo npm install -g truffle@4.1.13`
  * Install **Ganache-cli** globally:

    `$ sudo npm install -g ganache-cli@6.1.6`
  * Go to `$ ~/Development/DChallenge` and run `npm install`.
  * Install **niv** globally to be able to install **web3js 1.0** under a different name:

    `npm install -g npm-install-version`
  * Install **web3js 1.0** under the web3-v1 node modules directory name:

    `niv web3@1.0.0-beta.33 --destination web3-v1`
  * Go to `$ ~/Rinkeby/DChallenge` and run `npm install`.
  * Install **web3js 1.0** under the web3-v1 node modules directory name:

    `niv web3@1.0.0-beta.33 --destination web3-v1`


# Tests
## Set up (in order)
  * When all the modules are installed run **Ganache-cli**:

    `$ ganache-cli`

  * Open a new tab (pointing to the same directory) and deploy **Oraclize contracts**:

    `$ node node_modules/ethereum-bridge -H localhost:8545 -a 9 --dev`

  * Open a new tab (pointing to the same directory) and run **Truffle console**:

    `$ truffle console`

  * In Truffle console run the **tests**:

    `truffle(development)> test`

## Description
There are two test files, `DChallenge.js` and `TestOwnedUpgradeabilityProxy.sol`, each of them devoted to test one of the main contracts `DChallenge.sol` and `OwnedUpgradeabilityProxy.sol` respectively.

### DChalenge.js
It is an integration test where all possible owner and user actions are tested in sequential order. In addition, inherited contracts such as `Pausable.sol` and `Ownable.sol` are tested as well.

To make it possible there is a `before` hook where an **implementation** is set in the **proxy** and **the owner creates a new challenge**.

#### Owner actions
  * **Before hook**. Send transaction to the `OwnedUpgradeabilityProxy.sol` contract function `upgradeToAndCall(address implementation, bytes data)`, where the argument `implementation` is the address of the deployed `DChallenge.sol` contract and `data` contains the storage data and the signature of the function to be called after the upgrading happens.

  * **Create a new challenge**. Send transaction to `createChallenge(...)`. Gather the new challenge information calling to the public getter `challenge(uint)` and fetching the past logs matching with the event signature `challengeCreation`. If expected and fetched values match, tests pass.

  * **Modify initialized(constructor) values**. Send transactions to `setSubmitDelay(uint)`, `setTxDelay(uint)` and `setSecondsPerBlock(uint)`. Fetch their values calling to the public getters `submitDelay`, `txDelay` and `secondsPerBlock`. If expected and fetched values match, tests pass.

  * **Kills the contract**. Send transaction to `kill()`. If there is still code in the proxy address, the tests fail, if there is not (0x00), it means the contract code has been removed successfully and the tests pass.

#### User actions
  * **Participate in a challenge**. Send transaction to `participate(...)`. Call to the public getter `challenges(uint )` with the challenge id as argument. If the `challengesCounter` has been increased to 1, tests pass. Call to `userIsParticipating(uint _challengeId, address _userAddress)`, if it returns true, tests pass. Fetch data from past logs with `challengeParticipation` event signature, if challenge is and user address match with the expected values, tests pass.

  * **Submit video in a challenge**. Send transaction to `submit(...)`. Call to `userHasSubmitted(uint _challengeId, address _userAddress)`, if it returns true, tests pass. Fetch data from past logs with `challengeSubmission` event signature, if values match with the expected ones, tests pass.

  * **Oraclize closes the challenge and a winner is selected**. Automatically, when `closeTime` is reached, Oraclize contract send a transaction to `__callback(bytes32 _myid, string _result, bytes _proof)`, which call to `closeChallenge(uint _randomNumber)` with the random number generated by an external API. If the transaction success should an event should have been triggered. Fetch data from past logs with `challengeClosed` event signature, if values match with the expected ones, tests pass.

  * **Whitdraw his balance**. Because of being only one participant, the winner should the test user and the prize should have been assigned to his address. Send transaction to `userWithdraw(uint _amount)` with amount equal to challenge prize. If transactions success, the address balance should be equal to the balance before sending the transaction minus the withdrawal transaction cost plus the prize amount. If user address has the expected balance, tests pass.

#### Pausable test
  * To test `Pausable.sol` performance I chose one of functions where transaction should revert if modifier `whenNotPaused` returns false. Owner send transaction to `pause()` and afterwards User send transaction to `participate(...)`. If it reverts the tests pass.

#### Ownable test
  * To test `Ownable.sol` performance I chose one of the functions where transaction should revert if modifier `onlyOwner` returns false. A not owner send transaction to `setSubmitDelay(uint)`, if transaction reverts, tests pass.

### TestOwnedUpgradeabilityProxy.sol
They are a set of **Unit Tests**, where all features and capabilities of `OwnedUpgradeabilityProxy.sol` are tested.

To make it possible there is a `beforeAll` hook where an **implementation** is set in the **proxy** through a transaction to `upgradeToAndCall(address implementation, bytes data)`.

  * The first test consist in checking if the **proxy contract is pointing correctly to the right implementation**. Call to `implementation()` function, if fetched address matches with the expected, tests pass.

  * Test if the **implementation has been initialize properly**. Call to the implementation functions `setSubmitDelay(uint)`, `setTxDelay(uint)` and `setSecondsPerBlock(uint)`. If fetched values match with the expected ones, test pass.

  * Test **upgradeability feature**. Send transaction to `upgradeTo(address implementation)` function and then call to `implementation()`. If fetched address matches with the new address, tests pass.

  * Test **transferring ownership**. Send transaction to `transferProxyOwnership(address newOwner)` and then call to `proxyOwner()`. If fetched address matches with the new owner address, tests pass.

  * Test **reverting when trying to upgrade to the same implementation**. If the owner tries to upgrade to the same implementation the transaction should revert. Send transaction to `upgradeTo(address implementation)`, if it fails tests pass.



















#SECURITY
- using Library SafeMath to avoid overflow and underflow.

#DESIGN PATTERNS
Below I describe all the design patterns applied in this projects and also which of them I considered not applicable to it.

###FAIL EARLY - FAIL LOUD:
Use requires at the begining of the functions .
I do and I also I use modifiers like isOpen or isOngoing.

- RESTRICTING ACCESS: I have the Ownable contract with the onlyOwner modifier, the proxy contract is ownable as well.

- MORTAL: kill function implemented. with selfdestruct.

- WITHDRAWAL pattern

- STATE MACHINE: Not used to save GAS due to the state is already specified by reading openTime and closeTime. Cheaper reading state variables than having to depend on an external timed call as Oraclize which also would cost GAS unless having an own server dedicate to that task.

- CIRCUIT BREAKER: I use modifier whenNotPaused() from Pausable.sol of Zepelin to stop user from participating and submitting as also stopping Oraclize from closing challenges.

- SPEED BUMBP: Not used as it was found as unnecessary when already using a CIRCUIT BREAKER.


#VULNERABILITIES
- The use of 'now' in verifySubmission and the modifiers challengeIsOpen and challengeIsOngoing
- Doesn't have a fallback with revert() to reject ETH.
- Cuando se ordenan los inidices de los challenges para ser cerrados se puede superar el limite del gas del block, contrlarlo con gasleft()
