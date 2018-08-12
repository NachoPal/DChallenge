import {
  FETCH_ADMIN_INFO,
  OWNER_SETS_IMPLEMENTATION,
  OWNER_CREATES_CHALLENGE,
} from '../initializers/action_types';

const INITIAL_STATE = {
  ownerAddress: "0x0000000000000000000000000000000000000000",
  proxyAddress: "0x0000000000000000000000000000000000000000",
  implementationAddress: "0x0000000000000000000000000000000000000000"
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_ADMIN_INFO:
      return {
        ...state,
        implementationAddress: action.payload.implementationAddress,
        ownerAddress: action.payload.ownerAddress,
        proxyAddress: action.payload.proxyAddress
      };
    case OWNER_SETS_IMPLEMENTATION:
      return {
        ...state,
        implementationAddress: action.payload,
      };
    case OWNER_CREATES_CHALLENGE:
      return {...state};
    default:
      return {...state}
  }
}
