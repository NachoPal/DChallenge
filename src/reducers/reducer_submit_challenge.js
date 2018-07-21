import {
  GET_CONFIRMED_BLOCK,
  ACCEPT_BUTTON_CLICKED,
  VIDEO_SUBMITTED,
  SUBMIT_CHALLENGE,
  ERROR_SUBMIT_CHALLENGE
} from '../initializers/action_types';

const INITIAL_STATE = {
  id: null,
  confirmedBlock: null,
  code: '0x00000000000000000',
  videoDuration: null,
  ipfsHash: null,
  userAddress: null,
  codeAccepted: false,
  videoSubmitted: false,
  challengeSubmissionError: false
}

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case GET_CONFIRMED_BLOCK:
      return {
        ...state,
        code: action.payload.code,
        confirmedBlock: action.payload.confirmedBlock,
        userAddress: action.payload.userAddress,
        challengeSubmissionError: false
      }
    case ACCEPT_BUTTON_CLICKED:
      return {...state, codeAccepted: action.payload, videoSubmitted: false }
    case VIDEO_SUBMITTED:
      return {...state, ipfsHash: action.payload, videoSubmitted: true}
    case SUBMIT_CHALLENGE:
      return action.payload
    case ERROR_SUBMIT_CHALLENGE:
      return {...state, challengeSubmissionError: true, videoSubmitted: false}
    default:
      return {...state };
  }
}
