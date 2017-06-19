import { combineReducers } from "redux";
import auth from "./auth";
import job from "./job";
import likes from "./likes";

export default combineReducers({
  auth,
  job,
  likes
});
