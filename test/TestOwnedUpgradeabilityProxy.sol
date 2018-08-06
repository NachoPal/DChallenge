pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/OwnedUpgradeabilityProxy.sol";
import "../contracts/DChallenge.sol";

contract TestOwnedUpgradeabilityProxy {
    address implementationAddress = DeployedAddresses.DChallenge();
    OwnedUpgradeabilityProxy proxy = (new OwnedUpgradeabilityProxy).value(100000000)();
    DChallenge newImplementation = new DChallenge();

    uint submitDelay = 300;
    uint txDelay = 15;
    uint secondsPerBlock = 15;

    function beforeAll() public {
        bytes memory data = abi.encodeWithSignature(
            'initialize(uint256,uint256,uint256)',
            submitDelay,
            txDelay,
            secondsPerBlock
        );

        proxy.upgradeToAndCall(implementationAddress, data);
    }

    function testProxyIsPointingToImplementation() public {
        address expectedAddress = implementationAddress;
        address fetchedAddress = proxy.implementation();

        Assert.equal(expectedAddress, fetchedAddress, "Proxy does not point properly to new Implementation");
    }

    function testImplementationHasBeenInitialized() public {
        uint fetchedSubmitDelay = customCall(bytes4(keccak256('submitDelay()')));
        uint fetchedTxDelay = customCall(bytes4(keccak256('txDelay()')));
        uint fetchedSecondsPerBlock = customCall(bytes4(keccak256('secondsPerBlock()')));

        Assert.equal(
            submitDelay,
            fetchedSubmitDelay,
            "Implementation state variable submitDelay was not initialized properly"
        );

        Assert.equal(
            txDelay,
            fetchedTxDelay,
            "Implementation state variable txDelay was not initialized properly"
        );

        Assert.equal(
            secondsPerBlock,
            fetchedSecondsPerBlock,
            "Implementation state variable secondsPerBlock was not initialized properly"
        );
    }

    function testProxyUpgradesImplementation() public {
      proxy.upgradeTo(newImplementation);
      address fetchedAddress = proxy.implementation();

      Assert.equal(newImplementation, fetchedAddress, "Proxy does not upgrade properly the Implementation");
    }

    function customCall(bytes4 _data) internal returns(uint answer) {
        assembly {
            let ptr := mload(0x40)
            mstore(ptr,_data)
            let result := call(15000,sload(proxy_slot), 0, ptr, 0x04, ptr, 0x20)

            if eq(result, 0) {
                revert(0, 0)
            }

            answer := mload(ptr)
            mstore(0x40,add(ptr,0x04))
        }
    }
}
