import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import { View, Text, AsyncStorage } from "react-native";

// Resets Nav stack at main route
import { NavigationActions } from "react-navigation";
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "main" })]
});

class AuthScreen extends Component {
  // Log in to facebook on mount
  componentDidMount() {
    this.props.facebookLogin();
    this.onAuthComplete(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.onAuthComplete(nextProps);
  }
  // On Facebook success, navigate to main screen
  onAuthComplete(props) {
    if (props.token) {
      this.props.navigation.dispatch(resetAction);
    }
  }

  render() {
    return <View />;
  }
}

function mapStateToProps(state) {
  return {
    token: state.auth.token
  };
}

export default connect(mapStateToProps, actions)(AuthScreen);
