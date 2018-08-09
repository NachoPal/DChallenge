import {
  FETCH_ADMIN_INFO,
  OWNER_SETS_IMPLEMENTATION,
  OWNER_CREATES_CHALLENGE
} from '../initializers/action_types';
import {
  userAddressTo32Bytes,
  encodedEventSignature,
  decodeParameters,
  encodedFunctionCall
} from '../helpers/helper_web3';
import { implementationAbi } from '../initializers/implementation_info';
import { proxyAddress, proxyOptions, proxyContract, proxyAbi } from '../initializers/proxy_info';
import web3 from '../initializers/web3';
import web3meta from '../initializers/web3_metamask';
import { ipfs } from '../initializers/ipfs';



export function fetchAdminInfo() {
  return (dispatch) => {
    proxyContract.deployed().then((instance) => {
      instance.proxyOwner().then( owner => {
        instance.implementation().then( implementation => {
          return dispatch({
            type: FETCH_ADMIN_INFO,
            payload: {ownerAddress: owner, implementationAddress: implementation}
          });
        });
      });
    });
  }
}

export function setImplementation(implementationAddress) {
  const initializeInputs = {
    submitDelay: 300,
    txDelay: 15,
    secondsPerBlock: 15
  }

  return (dispatch) => {
    web3meta.eth.getAccounts((error, accounts) => {
      const ProxyContract = web3meta.eth.contract(proxyAbi);
      console.log(proxyAddress);
      const proxyInstance = ProxyContract.at(proxyAddress);

      proxyInstance.upgradeToAndCall(
        implementationAddress,
        encodedFunctionCall("initialize", Object.values(initializeInputs), implementationAbi),
        {from: accounts[0], gas: 3000000}
        , function(error, result) {
          if(!error) {
            return dispatch({
              type: OWNER_SETS_IMPLEMENTATION,
              payload: implementationAddress
            });
          }
        });
    });
  }
}

export function createChallenge(values, callback) {
  return (dispatch) => {
    ipfs.add(values.thumbnail, (err, thumbnailHash) => {
      ipfs.add(values.summary, (err, summaryHash) => {
        ipfs.add(values.description, (err, descriptionHash) => {
          const challengeInputs = {
              title: web3.utils.asciiToHex(values.title),
              summary: summaryHash[0].hash,
              description: descriptionHash[0].hash,
              thumbnail: thumbnailHash[0].hash,
              openTime: Math.floor((Date.now()/1000) + parseInt(values.openTime)),
              closeTime: Math.floor((Date.now()/1000) + parseInt(values.closeTime)),
              bettingPrice: parseInt(values.bettingPrice)
            }
          web3meta.eth.getAccounts((error, accounts) => {
            web3.eth.defaultAccount = accounts[0];
            web3meta.eth.sendTransaction(proxyOptions("createChallenge", challengeInputs, 0),
            function (error, result){
              if(!error) {
                callback();
                return dispatch({
                  type: OWNER_CREATES_CHALLENGE,
                  payload: null
                });
              }
            });
          });
        });
      });
    });
  }
}

function uploadFileToIPFS(values) {
  return (dispatch) => {

      return dispatch({
        type: OWNER_UPLOAD_FILE,
        payload: response
      });

  }
}
