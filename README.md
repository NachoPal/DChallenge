# What my project does?

# How to set it up
I created **two different branches** since there are some front-end code differences depending on what **Web3 provider** is used. In `development` branch the provider is `ganache-cli`, whereas in `rinkeby` it is the testnet Rinkeby via `infura`. Branch `master` is up to date with `rinkeby`, however it will be used in the future as **production branch** for the `mainnet`.

In addition, **signing transactions with uPort is not possible using a local RPC testnet** since there is no way for uPort servers to interact with the deployed contracts in the local network. There are only two possible options to be able to sign transactions with uPort, either to deploy the smart contracts to a testnet such as Rinkeby, or to set up a local private network with a JSON RPC public endpoint making use of [lambda-olorum](https://github.com/uport-project/lambda-olorun). For the sake of simplicity for evaluators, I decided not to set up a local private network run by a Geth node.

In regard Contracts code, there is an inevitable difference depending on the provider. For using Oraclize in a local RPC testnet it is necessary to hardcode in the contract constructor the OAR (Oraclize Address Resolver) address provided by [ethereum-bridge](https://github.com/oraclize/ethereum-bridge). Contracts from both branches are exactly the same with the exception of the following line in the constructor for the `development` branch: `OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);`. Therefore, passing tests in `development` ensures successful testing in `rinkeby` branch as well.gN

To summarize, `development` branch will be use to **run the tests** against `ganache-cli`, whereas `rinkeby` will be used to **interact with the front-end** being able in this way to sign transactions with **uPort**.

## Requirements
  * Ubuntu 16.04
  * Nodejs 10.9.0
  * Truffle 4.1.13
  * Ganache-cli 6.1.6

## Steps
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
  * Install Truffle:

    `$ sudo npm install -g truffle@4.1.13`
  * Install Ganache-cli:

    `$ sudo npm install -g ganache-cli@6.1.6`
  * Go to `$ ~/Development/DChallenge` and run `npm install`.
  * Install **niv** to be able to install **web3js 1.0** under a different name:

    `npm install -g npm-install-version`
  * Install web3js 1.0 under the web3-v1 node modules directory name:

    `niv web3@1.0.0-beta.33 --destination web3-v1`
  * Go to `$ ~/Rinkeby/DChallenge` and run `npm install`.
  * Install web3js 1.0 under the web3-v1 node modules directory name:

    `niv web3@1.0.0-beta.33 --destination web3-v1`


# Tests
## Set up
  * When all the modules are installed run **Ganache-cli**:

    `$ ganache-cli`

  * Open a new tab (pointing to the same directory) and deploy **Oraclize contracts**:

    `$ node node_modules/ethereum-bridge -H localhost:8545 -a 9 --dev`

  * Open a new tab (pointing to the same directory) and run **Truffle console**:

    `$ truffle console`

  * In Truffle console run the **tests**:

    `truffle(development)> test`

## Description






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
