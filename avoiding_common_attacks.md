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
