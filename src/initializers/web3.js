import Web3 from 'web3-v1';

export const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545");
