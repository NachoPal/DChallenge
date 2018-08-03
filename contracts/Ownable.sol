pragma solidity ^0.4.24;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    bytes32 private constant proxyOwnerPosition = keccak256("org.dchallenge.proxy.owner");

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
      require(msg.sender == proxyOwner());
      _;
    }

    /**
     * @dev Tells the address of the owner
     * @return the address of the owner
     */
    function proxyOwner() internal view returns (address owner) {
      bytes32 position = proxyOwnerPosition;
      assembly {
        owner := sload(position)
      }
    }
}
