# What my project does?

# How to set it up
I created **two different branches** since there are some code differences depending on what **Web3 provider** is used. In the `development` branch the provider is `ganache-cli`, whereas in `rinkeby` it is the testnet Rinkeby via `infura Websocket`. Branch `master` is up to date with `rinkeby`, however it will be used in the future as **production branch** for the `mainnet`.

In addition, **signing transactions with uPort is not possible using a local RPC testnet** since there is no way for uPort servers to interact with the deployed contracts in the local network. There are only two possible options to be able to sign transactions with uPort, either to deploy the smart contracts to a testnet such as Rinkeby, or to set up a local private network with a JSON RPC public endpoint making use of [lambda-olorum](https://github.com/uport-project/lambda-olorun). For the sake of simplicity for evaluators, I decided not to set up a local private network run by a Geth node.

There are others inevitable differences on code depending on the provider. One of them is the fact that for using Oraclize in a local RPC testnet it is necessary to hardcode in the contract constructor the OAR (Oraclize Address Resolver) address provided by [ethereum-bridge](https://github.com/oraclize/ethereum-bridge).

To summarize, `development` branch will be use to **run the tests** against `ganache-cli`, whereas `rinkeby` will be used to **interact with the front-end** being able in this way to sign transactions with **uPort**.

## Requirements
  * Ubuntu 16.04
  * Nodejs v10.9.0

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

# Test



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
