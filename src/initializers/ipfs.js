//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
const IPFS = require('ipfs-api');
export const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
export const URL_IPFS = "https://gateway.ipfs.io/ipfs/"

//run with local daemon
// const ipfsApi = require(‘ipfs-api’);
// const ipfs = new ipfsApi(‘localhost’, ‘5001’, {protocol:‘http’});
//export default ipfs;
