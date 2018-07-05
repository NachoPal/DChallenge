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
      console.log('RESPONSE', response);
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

export function userLogout() {
  return {
    type: USER_LOGOUT,
    payload: null
  }
}
