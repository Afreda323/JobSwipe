import { FACEBOOK_SUCCESS, FACEBOOK_FAIL, LOGOUT } from "../actions/types";

export default function(state = {}, action) {
  switch (action.type) {
    case FACEBOOK_SUCCESS:
      return { token: action.payload };
    case FACEBOOK_FAIL:
      return { token: null };
      case LOGOUT:
      return { token: null };
    default:
      return state;
  }
}
