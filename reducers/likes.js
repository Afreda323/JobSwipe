import { LIKE_JOB, CLEAR_JOBS } from "../actions/types";
import _ from "lodash";
export default function(state = [], action) {
  switch (action.type) {
    case CLEAR_JOBS:
      return [];
    case LIKE_JOB:
      return _.uniqBy([action.payload, ...state], "jobkey");
    default:
      return state;
  }
}
