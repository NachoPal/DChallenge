import {
  GET_CONFIRMED_BLOCK,
  ACCEPT_BUTTON_CLICKED,
  VIDEO_SUBMITTED,
  SUBMIT_TO_BLOCKCHAIN
} from '../initializers/action_types';

const INITIAL_STATE = {
  id: null,
  code: null,
  codeAccepted: false,
  confirmedBlock: null,
  userAddress: null,
  videoSubmitted: false,
  ipfsHash: null,
  videoDuration: null
}

export default function(state = INITIAL_STATE, action) {

  switch(action.type) {
    case GET_CONFIRMED_BLOCK:
      return {
        ...state,
        code: action.payload.code,
        confirmedBlock: action.payload.confirmedBlock,
        userAddress: action.payload.userAddress
      }
    case ACCEPT_BUTTON_CLICKED:
      return {...state, codeAccepted: action.payload, videoSubmitted: false }
    case VIDEO_SUBMITTED:
      return {...state, ipfsHash: action.payload, videoSubmitted: true}
    case SUBMIT_TO_BLOCKCHAIN:
      return action.payload
    default:
      return {...state };
  }
}
