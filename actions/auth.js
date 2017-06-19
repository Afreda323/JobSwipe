import { AsyncStorage } from "react-native";
import { Facebook } from "expo";

import { FACEBOOK_SUCCESS, FACEBOOK_FAIL, LOGOUT } from "./types";
const APP_ID = "1507344066007709";

export const facebookLogin = () => async dispatch => {
  let token = await AsyncStorage.getItem("fb_token");
  if (token) {
    dispatch({ type: FACEBOOK_SUCCESS, payload: token });
  } else attemptFBLogin(dispatch);
};

const attemptFBLogin = async dispatch => {
  let { type, token } = await Facebook.logInWithReadPermissionsAsync(APP_ID, {
    permissions: ["public_profile"]
  });
  if (type === "cancel") return dispatch({ type: FACEBOOK_FAIL });

  await AsyncStorage.setItem("fb_token", token);
  dispatch({ type: FACEBOOK_SUCCESS, payload: token });
};

export const logout = () => {
  AsyncStorage.removeItem("fb_token");
  return { type: LOGOUT };
};
