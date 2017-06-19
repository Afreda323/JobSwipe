import React, { Component } from "react";
import { View, Text, AsyncStorage } from "react-native";
import { AppLoading } from "expo";
import Slides from "../components/Slides";
import _ from "lodash";
import { NavigationActions } from "react-navigation";
// Resets Nav stack at main route
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "main" })]
});
// Slider stuff
const SLIDE_DATA = [
  { text: "Welcome to JobSwipe", color: "#03a9f4" },
  { text: "Life is short, get a job you actually love", color: "#009688" },
  { text: "Set your location, and swipe to your next job", color: "#03a9f4" }
];

class WelcomeScreen extends Component {
  state = { token: null };
  // Check for a FB token, and route accordingly
  async componentDidMount() {
    let token = await AsyncStorage.getItem("fb_token");
    if (token) {
      this.setState({ token }, () => {
        this.route();
      });
    } else {
      this.setState({ token: false });
    }
  }
  route() {
    const { dispatch } = this.props.navigation;
    dispatch(resetAction);
  }
  onComplete = () => {
    const { navigate } = this.props.navigation;
    navigate("auth");
  };
  render() {
    if (_.isNull(this.state.token)) {
      return <AppLoading />;
    }
    return <Slides data={SLIDE_DATA} onComplete={this.onComplete} />;
  }
}

export default WelcomeScreen;
