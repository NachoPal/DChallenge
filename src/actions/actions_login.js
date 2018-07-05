import {
  USER_LOGIN,
  USER_LOGIN_CANCELED
} from '../initializers/action_types';
import uport from '../initializers/uport';

export const userLogin = () => {

  return(dispatch) => {
    const userCredentials = uport.requestCredentials({
      requested: ['name', 'country', 'avatar', 'name'],
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
