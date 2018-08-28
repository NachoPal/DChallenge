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
