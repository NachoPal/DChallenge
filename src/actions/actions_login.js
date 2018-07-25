import {
  USER_LOGIN,
  USER_LOGIN_CANCELED,
  USER_LOGOUT,
  FETCH_USER_CHALLENGES_INDEX,

} from '../initializers/action_types';
import {
  YOUR_CHALLENGES_PATH
} from '../initializers/routes';
import uport from '../initializers/uport';
import {
  userAddressTo32Bytes,
  encodedEventSignature
} from '../helpers/helper_web3';
import { implementationAbi, } from '../initializers/implementation_info';
import { proxyAddress } from '../initializers/proxy_info';
import getChallengesIndex from './helpers/get_challenges_index';
import web3 from '../initializers/web3';


export function userLogin() {
  return(dispatch) => {
    const userCredentials = uport.requestCredentials({
      requested: ['name', 'country', 'avatar', 'email', 'phone'],
      notifications: true // We want this if we want to recieve credentials
    });

    userCredentials.then( response => {
      console.log("Loging re", response);
      dispatch({
              type: USER_LOGIN,
              payload: response
            });
    })
    .catch( (error) => {
      dispatch({
              type: USER_LOGIN_CANCELED,
              payload: error
            });
        });
  }
}

export function userLogout(location, callback) {
  sessionStorage.removeItem('user');
  if(location == YOUR_CHALLENGES_PATH) {
    callback();
  }
  return {
    type: USER_LOGOUT,
    payload: null
  }
}

export function fetchUserChallengesIndex(user, callback) {
  return(dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: 1,
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeParticipation", implementationAbi),
        null,
        userAddressTo32Bytes(user.details.address)
      ]
    }).then((logs) => {
      const participatingIndex = getChallengesIndex(logs, "challengeParticipation");
      web3.eth.getPastLogs({
        fromBlock: 1,
        address: proxyAddress,
        topics: [
          encodedEventSignature("challengeSubmission", implementationAbi),
          null,
          userAddressTo32Bytes(user.details.address)
        ]
      }).then((logs) => {
        const submissionIndex = getChallengesIndex(logs, "challengeSubmission");
        callback({...user, participating: participatingIndex, submissions: submissionIndex});
        return dispatch({
          type: FETCH_USER_CHALLENGES_INDEX,
          payload: {participating: participatingIndex, submissions: submissionIndex}
        });
      });
    });
  }
}
