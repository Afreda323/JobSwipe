import React, { Component } from "react";
import { View, Text } from "react-native";
import { Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import {NavigationActions} from 'react-navigation'
import { clearJobs, logout } from "../actions";
import {Constants} from 'expo'
// Resets Nav stack at welcome route
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "welcome" })]
});
class SettingScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Icon
            name="ios-settings"
            type="ionicon"
            color={tintColor}
            size={36}
          />
        );
      } else {
        return (
          <Icon
            name="ios-settings-outline"
            type="ionicon"
            color={tintColor}
            size={36}
          />
        );
      }
    }
  };
  state = {
    clicked: false
  };
  clearJobs = () => {
    this.props.clearJobs(this.setState({ clicked: true }));
  };
  logout = () => {
    const { dispatch } = this.props.navigation;
    dispatch(resetAction);
    this.props.logout();
  };
  renderButton = () => {
    if (this.props.likes.length < 1) {
      return (
        <Button
          buttonStyle={{ marginTop: 20 }}
          title="Jobs Cleared"
          large
          icon={{
            type: "ionicon",
            name: "ios-checkmark-circle-outline",
            style: { fontSize: 30 }
          }}
          backgroundColor="rgb(76, 217, 100)"
          onPress={this.clearJobs}
        />
      );
    } else {
      return (
        <Button
          title="Reset Liked Jobs"
          large
          buttonStyle={{ marginTop: 20 }}
          icon={{
            type: "ionicon",
            name: "ios-trash-outline",
            style: { fontSize: 30 }
          }}
          backgroundColor="rgb(255, 59, 48)"
          onPress={this.clearJobs}
        />
      );
    }
  };
  render() {
    return (
      <View style={{marginTop: Constants.statusBarHeight}}>
        {this.renderButton()}
        <Button
          buttonStyle={{ marginTop: 20 }}
          title="Log Out"
          large
          icon={{
            type: "ionicon",
            name: "ios-log-out-outline",
            style: { fontSize: 30 }
          }}
          backgroundColor="rgb(88, 86, 214)"
          onPress={this.logout}
        />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    likes: state.likes
  };
}
export default connect(mapStateToProps, { clearJobs, logout })(SettingScreen);
