import {
  USER_LOGIN,
  USER_LOGIN_CANCELED,
  USER_LOGOUT
} from '../initializers/action_types';
import uport from '../initializers/uport';

export function userLogin() {

  return(dispatch) => {
    const userCredentials = uport.requestCredentials({
      requested: ['name', 'country', 'avatar', 'email', 'phone'],
      notifications: true // We want this if we want to recieve credentials
    });

    userCredentials.then( response => {
      web3.eth.getPastLogs({
        fromBlock: 1,
        address: proxyAddress,
        topics: [
          encodedEventSignature("userParticipaton", implementationAbi),
          null,
          userAddressTo32bytes(response.address)
        ]
      }).then((logs) => {
            //buildChallengesObject(logs, dispatch, FETCH_OPEN_CHALLENGES)
            console.log("LOGS USER", logs);
            sessionStorage.setItem('user', JSON.stringify(response));
            dispatch({
                    type: USER_LOGIN,
                    payload: response
                  });
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

export function userLogout() {
  sessionStorage.removeItem('user');
  return {
    type: USER_LOGOUT,
    payload: null
  }
}
