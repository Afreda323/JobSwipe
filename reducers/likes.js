import { LIKE_JOB, CLEAR_JOBS } from "../actions/types";
import _ from "lodash";
import { AsyncStorage } from "react-native";
import { REHYDRATE } from "redux-persist/constants";
export default function(state = [], action) {
  switch (action.type) {
    case REHYDRATE:
      return action.payload.likes || [];
    case CLEAR_JOBS:
      return [];
    case LIKE_JOB:
      return _.uniqBy([action.payload, ...state], "jobkey");
    default:
      return state;
  }
}
