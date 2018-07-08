import { web3 } from './web3';
import _ from 'lodash';

var abi = {
  v0: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "title",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "name": "openTime",
          "type": "uint256"
        },
        {
          "indexed": true,
          "name": "closeTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "thumbnail",
          "type": "bytes32"
        }
      ],
      "name": "challengeCreation",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_title",
          "type": "bytes32"
        },
        {
          "name": "_description",
          "type": "bytes32"
        },
        {
          "name": "_thumbnail",
          "type": "bytes32"
        },
        {
          "name": "_openTime",
          "type": "uint256"
        },
        {
          "name": "_closeTime",
          "type": "uint256"
        }
      ],
      "name": "createChallenge",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}

const implementationAbi_V0 = _.mapKeys(abi["v0"],"name");
export const createChallengeFunction_V0 = web3.eth.abi.encodeFunctionSignature(implementationAbi_V0["createChallenge"]);
export const challengeCreationEvent = web3.eth.abi.encodeFunctionSignature(implementationAbi_V0["challengeCreation"]);
