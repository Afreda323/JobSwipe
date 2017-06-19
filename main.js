import Expo from "expo";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Provider } from "react-redux";
import store from "./store";
import { TabNavigator, StackNavigator, TabBarBottom } from "react-navigation";

import AuthScreen from "./screens/AuthScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

import MapScreen from "./screens/MapScreen";
import DeckScreen from "./screens/DeckScreen";

import ReviewScreen from "./screens/ReviewScreen";
import SettingsScreen from "./screens/SettingsScreen";

class App extends React.Component {
  render() {
    const MainNav = TabNavigator(
      {
        map: { screen: MapScreen },
        deck: { screen: DeckScreen },
        review: { screen: ReviewScreen },
        settings: { screen: SettingsScreen }
      },
      {
        tabBarComponent: TabBarBottom,
        tabBarPosition: "bottom",
        lazy: true,
        swipeEnabled: false,
        tabBarOptions: {
          showLabel: false,
          style: {
            backgroundColor: "white"
          }
        }
      }
    );
    const WelcomeNav = StackNavigator(
      {
        welcome: { screen: WelcomeScreen },
        auth: { screen: AuthScreen },
        main: {
          screen: MainNav
        }
      },
      {
        headerMode: "none",
        lazy: true,
        navigationOptions: {
          tabBarVisible: false,
        },
        cardStyle: {
          backgroundColor: '#fff'
        }
      }
    );
    return (
      <Provider store={store}>
        <WelcomeNav />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

Expo.registerRootComponent(App);
