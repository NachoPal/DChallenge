const web3 = require('../initializers/web3');
import { proxyAddress } from '../initializers/proxy_info';
import { implementationAbi } from '../initializers/implementation_info';
import {
  FETCH_CHALLENGE,
  FETCH_VIDEOS,
  UPDATE_VIDEOS,
  REMOVE_CHALLENGE_DATA
} from '../initializers/action_types';
import {
  encodedEventSignature,
  numberTo32bytes
 } from '../helpers/helper_web3';
import buildChallengesObject from './helpers/build_challenges_object';
import getVideosHash from './helpers/get_videos_hash';


export function fetchChallenge(id) {
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeCreation", implementationAbi),
        numberTo32bytes(id)
      ]
    }).then((logs) => {
          buildChallengesObject(logs, dispatch, FETCH_CHALLENGE)
      });
  }
}

export function fetchVideos(id) {
  return (dispatch) => {
    web3.eth.getPastLogs({
      fromBlock: "0x1",
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeSubmission", implementationAbi),
        numberTo32bytes(id)
      ]
    }).then((logs) => {
          return getVideosHash(logs, dispatch, FETCH_VIDEOS);
      });
  }
}

export function updateVideos(id) {
  return dispatch => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [
        encodedEventSignature("challengeSubmission", implementationAbi),
        numberTo32bytes(id)
      ]
    }, (error, result) => {
        if(!error) {}
    }).on("data", (logs) => {
      return getVideosHash([logs], dispatch, UPDATE_VIDEOS);
    }).on("changed", (logs) => {

    });
  }
}

export function updateWinnerVideo(id) {
  return (dispatch) => {
    const subscription = web3.eth.subscribe('logs', {
      address: proxyAddress,
      topics: [encodedEventSignature("challengeClosed", implementationAbi)]
    }, (error, result) => {
        if(!error) {}
    }).on("data", (logs) => {
      fetchVideos(id)
    }).on("changed", (logs) => {

    });
  }
}

export function removeChallengeData() {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_CHALLENGE_DATA,
      payload: null
    });
  }
}
