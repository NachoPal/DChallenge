# What my project does?
DChallenge is a Ethereum based Dapp where people can participate in different challenges/contests and submit videos to prove they have completed them. At the end, a winner will be chosen among all participants. There is an app's owner/admin in charge of creating and launching new challenges. Challenges are formed by a thumbnail, summary, description and an entry fee in Wei units. In addition, every challenge will go through three different states, **OPEN**, **ONGOING**, and **CLOSED**. These periods are defined by two storage variables based on Unix epoch time: `openTime` and `closeTime`. **OPEN** is the period of time between challenge creation and `openTime`, **ONGOING** the period between `openTime` and `closeTime`, and **CLOSED** the period from `closeTime` onwards.

## OPEN
Users can participate in the challenge. For doing that they need first to login with uPort and pay the entry fee.

## ONGOING
Only users that signed in the challenge are allowed to submit a video. To prevent users from sending old videos that were not recorded during this period, or videos that they do not own, I developed a trusted timestamping and ownership proof system.

When the user wants to record a video to be submitted, a 4 digits **CODE** which is updated every 30 seconds (around 2 blocks) is shown. The first thing the user will have to say on camera is the **CODE**, after that no cuts are allowed to avoid video editions. The **CODE** along with the video's length will prove that it was recorded at certain time and by the user that claims to be the owner.

The **CODE** is calculated as follows: Every 30 seconds current `blockHash` is retrieved and `keccak256` encoded along with the `userAddress`. Due to a very low hash collision chance, the first 4 hex digits are enough as identification.

Video is sent to IPFS, hash retrieved and transaction signed with the following information: `_challengeId`, `_blockNumber`, `_code`, `_videoDuration` and `_ipfsHash`.
In the contract, the submissions is verified in two ways. First of all, the code is calculated again:

```
bytes32 blockHash = blockhash(_blockNumber);
bytes32 code = keccak256(abi.encodePacked(_userAddress, blockHash));

if (_code != code) {
    return false;
}
```

and secondly it is checked if the time since the video was recorded until the transaction was mined is less than the video duration plus a submission delay, being `secondsPerBlock` and `submitDelay` storage variables set by contract's owner depending on current network performance/congestion.

```
uint currentBlockNumber = block.number;
uint challengeDuration = _videoDuration.add(submitDelay);
uint timeBetweenBlocks = (currentBlockNumber.sub(_blockNumber)).mul(secondsPerBlock);

if (timeBetweenBlocks > challengeDuration) {
    return false;
}
```

All uploaded videos where the **CODE** said on camera does not match with the **CODE** they are linked to, or all of those videos where the **video duration** does not match either, will be considered not legit.

## CLOSED
When submission period is over, **Oraclize** makes a call to the following API `"https://www.random.org/integers/` getting a random number as response. That number is used to choose the winner between all submissions. Winner gets the jackpot, and this is added to his available balance ready to be withdrawn.

# How to set it up
I created **two different branches** since there are some front-end code differences depending on what **Web3 provider** is used. In `development` branch the provider is `ganache-cli`, whereas in `rinkeby` it is the testnet Rinkeby via `infura`. Branch `master` is up to date with `rinkeby`, however it will be used in the future as **production branch** for the `mainnet` and for updating the project while peer evaluation.

In addition, **signing transactions with uPort is not possible using a local RPC testnet** since there is no way for uPort servers to interact with the deployed contracts in the local network. There are only two possible options to be able to sign transactions with uPort, either to deploy the smart contracts to a testnet such as Rinkeby, or to set up a local private network with a JSON RPC public endpoint making use of [lambda-olorum](https://github.com/uport-project/lambda-olorun). For the sake of simplicity for evaluators, I decided not to set up a local private network run by a Geth node. A **uPort** mobile app update is coming soon, and in the worst of the situations it will happen during peer evaluation, breaking the app functionality. Because of that, I created another branch `uport_update` where I tried to prevent future errors and keep my app working. Unfortunately, I can not ensure it will work as it is obviously impossible to test before the update is released and maybe future changes are needed.

In regard Contracts code, there is an inevitable difference depending on the provider. For using Oraclize in a local RPC testnet it is necessary to hardcode in the contract constructor the OAR (Oraclize Address Resolver) address provided by [ethereum-bridge](https://github.com/oraclize/ethereum-bridge). Contracts from both branches are exactly the same with the exception of the following line in the constructor for the `development` branch:
```
OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
```
Therefore, passing tests in `development` ensures successful testing in `rinkeby` branch as well.

To summarize, the branches used for evaluating are: `development` branch will be use to **run the tests** against `ganache-cli`, whereas `rinkeby` will be used to **interact with the front-end** being able in this way to sign transactions with **uPort**.

Because of **uPort** having a dependency on **web3 v0.19** I needed to install **web3 v1.0.0** under other name to avoid conflicts and be able to use **Web Sockets**. To make it possible I made use of the package `npm-install-version`.

## Requirements
  * Ubuntu 16.04
  * Nodejs 10.9.0
  * Truffle 4.1.13
  * Ganache-cli 6.1.6
  * Chrome (recommended browser)

## Steps (in order)
Before going through the next sections, follow these steps. If after this set up you encounter any error running the Dapp or its tests, make sure you have installed the same versions, specially in **Truffle** and **Ganache-cli** cases.

  * Install the last version of **Nodejs** and **npm**:

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
  * Go to `$ ~/Development/DChallenge` and run `$ npm install`.
  * Install **niv** globally to be able to install **web3js 1.0** under a different name:

    `$ npm install -g npm-install-version`
  * Install **web3js 1.0** under the web3-v1 node modules directory name:

    `$ niv web3@1.0.0-beta.33 --destination web3-v1`
  * Go to `$ ~/Rinkeby/DChallenge` and run `$ npm install`.
  * Install **web3js 1.0** under the web3-v1 node modules directory name:

    `$ niv web3@1.0.0-beta.33 --destination web3-v1`

# Interacting with the Dapp
In this section we are gonna test the app through the UI/front-end. When you clone the `rinkeby` branch repository you will notice that the `/build` projects with the contracts artifacts is available, this is because they are already pointing to the deployed contracts in Rinkeby testnet. So do not remove it and do not run the migrations again.

If you run into some error, please, try to follow the steps again from the beginning before evaluation and if the error persist, contact me in `ignacio.palacios.santos@gmail.com`. Sometimes **INFURA** or **IPFS** connections fails and I don't catch the exceptions everywhere yet. Right now the provider for Rinkeby is `wss://rinkeby.infura.io/_ws`, in case it fails try switching to `wss://rinkeby.infura.io/ws`. You can find the code line in `/src/initializers/web3.js:10`.

## Set up (in order)
  * Go to `$ ~/Rinkeby/DChallenge`.
  * Copy `video_chrome.mp4` and `video_firefox.ogv` from `$ ~/Development/DChallenge` (I could not add the current videos in `rinkeby` branch sorry, they are like void files).
  * Run `$ npm start`.
  * Make sure you have installed the Metamask plugin in your browser.
  * In Metamask, switch to **Rinkeby Test Net**.
  * Click **Importing Existing DEN**.
  * Copy and paste the following **mnemonic** `above decline twin original artefact debate fade duck fossil enact sorry there`, enter a password of your choice and click OK. You will have access then to the Owner's account with address `0xf022797e23c6683b17bd2fe5e1b75250fdc851e4` that already holds some ETH.
  * Download the **uPort mobile app**, follow the steps you are asked and create an **Identity**.
  * **Fund** with some ETH (at least 1 ETH) your Identity Contract. To do so you just need to send some ETH from a Rinkeby account to your **Identity Contract address**.  
  * In a browser's tab go to `localhost:8080`. You should see the **landing page** of the Dapp (It will throw an error if Metamask is not installed).


## User stories
There are two kind of users, Owner(Admin) and regular User(Participant).

| Story ID | Scope       | I expect that I can...  | So that.. |
|:--------:|:-----------:| ----------------------- | --------- |
| US-01    | Admin       | change implementation address | contract logic can be upgraded |
| US-02    | Admin       | create a new challenge | users can participate in it |
| US-03    | Participant | log in | I can participate in a challenge |
| US-04    | Participant | participate in the new challenge | I can submit a video |
| US-05    | Participant | submit a video | I can aim for winning the prize |
| US-06    | Oraclize    | see who is the winner | I can withdraw the prize |
| US-07    | Participant | withdraw the prize | I receive the ETH in my account |
| US-08    | Participant | log out | my challenges are shown again in the main sections |

### US-01
In `localhost:8080/admin`. You will see that in the **PROXY - UPGRADEABILITY** section are shown the Owner, Proxy and Implementation addresses. As Admin you have the option to upgrade the Contract logic, and make the Proxy contract to point another Contract Implementation. However, I don't recommend it because it could cause failures in the Dapp behavior to other evaluators while it is pointing to the wrong contract (potentially an address without any/wrong code). In any case, If you try it, make sure you change it back to the address `0xc75c984d12f9060123a7a1b781833d805dddfa7c`  

### US-02
In `localhost:8080/admin`. In the section **CREATE A CHALLENGE** I recommend you to fill the form in this way:
  * **Name**: Write your name, so it will be easier to identify your created challenge.
  * **Thumbnail**: Add the image named `thumbnail.jpeg` you can find in the repository's root folder.
  * **Summary**: Add the document named `summary.html` you can find in the repository's root folder.
  * **Description**: Add the document named `description.html` you can find in the repository's root folder.
  * **OpenTime**: Set it to a minimum of 360 seconds, but I recommend more since transactions sometimes take too long to be mined, being the challenge already in ONGOING state by that time. Set around 700 seconds, even if you have to wait more, but you will be sure that you will not have to repeat the process. That will provide you enough time to participate in the challenge.
  * **CloseTime**: Set it to a minimum of 720 seconds or 360 seconds more than OpenTime. It will provide you enough time to submit a video in the challenge.

**Submit the challenge**, and after the files are uploaded to IPFS, you will be asked to sign the transaction with Metamask and redirected to **OPEN CHALLENGES** section. When the transaction is mined, the new challenge will show up (if it doesn't show up, refresh the page).

### US-03
In `localhost:8080/open-challenges`. To be able to participate in a challenge you have to login via **uPort**. Click **LOGIN** button and **scan the QR code** with the uPort mobile app. It will ask you for login confirmation. Once you are logged, an **account icon** and **YOURS** section will be displayed.

### US-04
In `localhost:8080/open-challenges`. Once you are logged, click your challenge's **PARTICIPATE** button. **Scan the QR code** and again, uPort mobile app will ask for confirmation. Once the transaction is confirmed, you will be redirected to **YOURS** section (the challenge will disappear from **OPEN CHALLENGES**). Number of participants and jackpot will be updated.

### US-05
In `localhost:8080/your-open-challenges`. Click your **challenge Title**, you will be redirected to the challenge view `localhost:8080/challenge/:id`, being `:id` the **id** of your challenge. Wait until the challenge change to ONGOING state. Click the **SUBMIT** button. A modal will pop up, **ACCEPT** the CODE, select the video named `video_firfox.ogv` (in firefox) or `video_chrome.mp4` (in chrome) you can find in the repository's root folder and **SEND** it to IPFS. Once the video is uploaded, click **SUBMIT**. Scan the QR code and approve the transaction in uPort. Once the transaction is confirmed, your video will be included in the view and the number of submissions updated.  

### US-06
In `localhost:8080/challenge/:id`. After submission, wait until the submission period ends and challenge state change to CLOSED, then the page will be refreshed automatically, and if the Oraclize transaction has not been yet mined, you will see **CHOOSING WINNER...** in he **VIDEOS** section. Once Oraclize transaction is mined, and the challenge closed, you will see who is the winner.

### US-07
In `localhost:8080/account`. Click the **account icon** in the navigation bar and you will be redirected to your account. If you won the prize, you should have the amount available in your balance. Click the **WITHDRAW** button, scan QR code and approve transaction. Once transaction is mined, check your uPort mobile app, the credit will have been added to your Identity Contract.

### US-08
Click on **LOGOUT** button, account icon and YOURS sections will hide, and all your challenges will show up again in their respective sections (OPEN, ONGOING and CLOSED).

# Tests
## Set up (in order)
  * Go to `$ ~/Development/DChallenge`
  * If all the modules are installed run **Ganache-cli**:

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

# Design Patterns
Below I describe all the design patterns applied in this projects and also which of them I considered not applicable to it.

## Circuit breaker
I use modifier `whenNotPaused` from `Pausable.sol` of **Zepelin** to stop user from participating and submitting and also stopping **Oraclize** from closing challenges.
I considered it a useful pattern to stop contract execution in case a bug is found while it is fixed and contract version updated.

## Fail early - fail loud
I use `requires` at the beginning of the functions, throwing exceptions and failing as in function execution possible. In addition I use different modifiers such as `challengeIsOpen` and `challengeIsOngoing`.

## Restricting access
I make use of `Ownable.sol` contract with the `onlyOwner` modifier, the proxy contract is *ownable* as well by itself.

## Auto deprecation
This design pattern does not make much sense in my project since I am already using a upgradeability pattern where I just need to upgrade the logic version of my contract to make the previous one deprecated.

## Mortal
I implemented a `kill` function which makes use of `selfdestruct`.

```
function kill() external onlyOwner {
    selfdestruct(proxyOwner());
}
```

## Withdrawal pattern / pull over push payments
I make use of the withdrawal pattern. External calls can fail accidentally or deliberately, it is better to let users withdraw funds rather than push funds to them automatically

```
function userWithdraw(uint _amount) external whenNotPaused {
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] -= _amount;
    msg.sender.transfer(_amount);
}
```

## State Machine
Even being very helpful in my Dapp, where there are 3 states, **OPEN**, **ONGOING** and **CLOSED**. I decided not to implement this design pattern due to the fact the state is already specified by reading the values of `openTime` and `closeTime`. In this way I save `GAS` in two ways, not using the an extra storage variable and not having to make user of **Oraclize** to change the state from **OPEN** to **ONGOING**. In the future I will set up an own server which will handle this transactions to save Oraclize's fees. In addition, the current state depends on solidity global variable `now`, which is not very recommend, however, it does not affect much in my Dapp, where a 30 seconds timestamp miner's modification is insignificant compared to long state periods. Modifiers `challengeIsOpen` and `challengeIsOngoing` control the state flow.

## Speed bump
Not used as I considered it was unnecessary having already a **Circuit Breaker**.

## Upgradeability pattern
After a thorough research of all upgradeability patters, I decided that the best one was **Upgradeability using unstructured storage**, which is actually the one used in [ZeppelinOS](https://zeppelinos.org/). This idea builds on upgradeability using inherited storage but redefining the storage structure of the contracts required for upgradeability purpose. The idea here is to use fixed storage slots to store the required data for upgradeability purpose, this is the upgradeability owner and the implementation address. Inline assembly is used to store and access mentioned variables in fixed storage positions indexing them with custom keys using `keccak256`.

To summarize, there is a main contract `OwnedUpgradeabilityProxy.sol` which inherit from `UpgradeabilityProxy` that handles upgradeability (owner and implementation), and from `Proxy.sol`, where the fallback function is. The fallback function will make message calls to the implementation contract. In this way the storage and the logic are completely independent, so if any bug is encountered in the implementation you just need to switch to a new contract without losing the stored data.

In this Dapp the proxy points to a `DChallenge.sol` contract implementation, where the logic is.

# Security tools / Common Attacks
## Security tools
I made use of the following Security Tools:
  * [SmartCheck](https://tool.smartdec.net/)
  * [SolCheck](https://github.com/federicobond/solcheck)

## Common Attacks
I'm going to describe what measures has been taken to ensure that the contract `DChallenge.sol` is not susceptible to common attacks. The rest of contracts in this project are from **Oraclize**, **Zeppelin** or **ConsenSys**, so that they are already well audited.

### Reentrancy and Race Conditions
The only external call to an unknown address in my contract is the one in `userWithdraw` function. To avoid this kind of attack I used the **pull over push payments** pattern where the user has to call the function and also `transfer()` is used over `call()` to transfer the balance.

```
function userWithdraw(uint _amount) external whenNotPaused {
    require(balances[msg.sender] >= _amount);
    balances[msg.sender] -= _amount;
    msg.sender.transfer(_amount);
}
```

### Integer Overflow and Underflow
To avoid this attack I made use of the library `SafeMath.sol` and use it in the mathematical operations susceptible to attacks.

### Denial of Service - revert
I made sure there is not any `require` in `DChallenge.sol` that can block the normal flow of the app forever.

### Denial of Service - block gas limit.
In the function `orderChallengesToCloseById((uint _closeTime))`, because of being a loop depending on the length of an array, block gas limit might be reached. That situation would happen if `_closeTime` is a very low value compared with the rest of challenges, and the array size of challenges to be closed is very long. That could have been solved controlling `gasleft()` inside the loop, but since it is an internal function called only by Owner, a trusted party, and specially because stoping the execution without reverting wouldn't have the expected function behavior, I did not take any action.

The solution to this is to build an own API to be called by **Oraclize**, where challenges closing order is tracked. In this way would be just necessary to reply with the index value of `challengesClosingOrder`, avoiding ordering challenges based on `closeTime` during creation.

### Forcibly Sending Ether to a Contract
There are two lines where the contract depends on its balance,
```
if (oraclize_getPrice("URL") > address(this).balance)
```
and
```
require(balances[msg.sender] >= _amount);
```

In both situations we check that the balance should be equal or bigger than a certain amount, never smaller than, so receiving unexpected ETH from another account is not a possible attack.

I did not implement any fallback in the contract, since its gonna be always called via `delegatecall()` from the proxy contract. It means that if the call's function signature does not match with any of the functions of `DChallenge.sol` it will produce an exception in `Proxy.sol` fallback.

# Library / EthPM
**Oraclize** contracts are installed via EthPM and I also import the library `SafeMath.sol`

# Additional Requirements
Smart Contracts are properly commented according to Solidity documentation.

# Stretch Requirements
## IPFS
It is used to store challenge's thumbnail(image), videos(video), summary(html) and description(html) files.

## uPort
It is used to login and signing transactions by users. Owner signs transactions with Metamask when creating challenges.

## Oracle
**Oraclize** is used to close the challenges automatically when `now == closeTime` and to get a random number from an external API.

## Project implements an upgradeable pattern
Yes, it does. It is explained in **Design Patterns** section.

## Testnet Deployment
Contracts have been deployed to Rinkeby and addresses can be found in `deployed_addresses.txt`

# License
Copyright (C) 2018 DChallenge.

# Take a look at my Blog :)
http://www.rubyonblockchain.com/ (Still only in Spanish)
