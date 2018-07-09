const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import {
  FECTH_OPEN_CHALLENGES
} from '../initializers/action_types';
import { encodedEventSignature } from '../initializers/implementation_info';


export function fetchOpenChallenges() {
  console.log("entra");
  return (dispatch) => {

    // web3.eth.getPastLogs({
    //   address: proxyAddress,
    //   topics: [encodedEventSignature("challengeCreation")]
    // }).then((log) => {
    //     dispatch({
    //                type: FECTH_OPEN_CHALLENGES,
    //                payload: log
    //              });
    //   }
    // );

    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [encodedEventSignature("challengeCreation")]
    }, (error, result) => {
        if(!error) console.log(result);
    }).on("data", (log) => {
      console.log(log);
      dispatch({
              type: FECTH_OPEN_CHALLENGES,
              payload: log
            });
    }).on("changed", (log) => {
      console.log(log);
    });
  }

  const openChallenges = {};

  // return {
  //   type: FECTH_OPEN_CHALLENGES,
  //   payload: openChallenges
  // }
}
