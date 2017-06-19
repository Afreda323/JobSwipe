import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  UIManager,
  LayoutAnimation,
  Keyboard,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import { MapView, Location, Permissions, Constants } from "expo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Button, Icon, Slider } from "react-native-elements";

import * as actions from "../actions";
import { GOOGLE_KEY } from "./Google";

class MapScreen extends Component {
  static navigationOptions = {
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Icon
            name="ios-navigate"
            type="ionicon"
            color={tintColor}
            size={36}
          />
        );
      } else {
        return (
          <Icon
            name="ios-navigate-outline"
            type="ionicon"
            color={tintColor}
            size={36}
          />
        );
      }
    }
  };
  state = {
    loading: false,
    region: {
      latitude: 35.2,
      longitude: -80.9,
      longitudeDelta: 0.5,
      latitudeDelta: 1
    },
    radius: 8,
    search: "",
    mapLoaded: false,
    errorMessage: ""
  };
  // Make sure map loaded, remove the activityIndicator
  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    this.setState({ mapLoaded: true });
  }
  // Make sure it's a device, and check for geo services
  attemptGeo = () => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this.getLocation();
    }
  };
  // Promt user for permission, set map state to location
  getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      region: {
        ...this.state.region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    });
  };
  // Set new coordinates on map move
  onRegionChangeComplete = region => {
    this.setState({ region });
  };
  // Search for jobs on button press, add loader
  onButtonPress = () => {
    const { region, search, radius } = this.state;
    Keyboard.dismiss();
    LayoutAnimation.spring();
    this.setState({ loading: true });
    this.props.fetchJobs(this.state.region, search, radius, () => {
      this.setState({ loading: false });
      this.props.navigation.navigate("deck");
    });
  };
  renderButton = () => {
    if (this.state.loading) {
      return (
        <View style={styles.activeWrap}>
          <ActivityIndicator size="large" color="white" />
        </View>
      );
    } else {
      return (
        <Button
          large={this.state.search.length > 1}
          title="Search This Area"
          onPress={this.onButtonPress}
          backgroundColor="rgba(0,122,255,1)"
          disabled={this.state.search.length < 2}
          disabledStyle={{ backgroundColor: "rgba(140,199,255,0.9)" }}
          icon={{
            name: "ios-search",
            type: "ionicon",
            style: { fontSize: 30 }
          }}
        />
      );
    }
  };
  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="white" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}>
          <MapView.Marker
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude
            }}
            title="Your location"
            pinColor="rgba(0,122,255,1)"
          />
          <MapView.Circle
            center={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude
            }}
            radius={this.state.radius * 1609.344}
            strokeColor="rgba(0,122,255,1)"
            fillColor="rgba(0,122,255,0.1)"
          />
        </MapView>
        <View style={styles.geoContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search for location"
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="auto" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              this.setState({
                region: {
                  longitudeDelta: 0.5,
                  latitudeDelta: 1,
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng
                },
                radius: 8
              });
            }}
            getDefaultValue={() => {
              return ""; // text input default value
            }}
            query={{
              key: GOOGLE_KEY,
              language: "en", // language of the results
              types: "(cities)" // default: 'geocode'
            }}
            styles={{
              textInput: {
                height: 32,
                fontSize: 18
              },
              textInputContainer: {
                paddingHorizontal: 15,
                backgroundColor: "#fff",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: "rgba(0,122,255,1)"
              },
              container: {
                paddingVertical: 7,
                paddingHorizontal: 15
              },
              listView: {
                backgroundColor: "#fff"
              },
              description: {
                fontWeight: "bold"
              }
            }}
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            filterReverseGeocodingByTypes={[
              "locality",
              "administrative_area_level_3"
            ]}
            isRowScrollable={false}
            debounce={200}
            renderLeftButton={() =>
              <Icon
                name="ios-search"
                type="ionicon"
                color="rgba(0,122,255,1)"
                size={30}
              />}
          />
          <Button
            title="Get Current Location"
            onPress={this.attemptGeo}
            backgroundColor="rgba(0,122,255,1)"
            icon={{
              name: "ios-locate-outline",
              type: "ionicon",
              style: { fontSize: 30 }
            }}
          />
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.buttonContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your dream job"
            value={this.state.search}
            onChangeText={search => this.setState({ search })}
          />
          <View style={styles.sliderWrap}>
            <View style={{ flexGrow: 3 }}>
              <Slider
                value={this.state.radius}
                onValueChange={radius => this.setState({ radius })}
                minimumTrackTintColor="rgba(0,122,255,0.6)"
                thumbTintColor="rgba(0,122,255,1)"
                maximumTrackTintColor="rgba(0,122,255,0.4)"
                minimumValue={1}
                maximumValue={100}
                step={1}
              />
            </View>
            <Text style={{ color: "rgba(0,0,0,0.7)", paddingHorizontal: 10 }}>
              {this.state.radius}mi
            </Text>
          </View>
          {this.renderButton()}
        </KeyboardAvoidingView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  textInput: {
    height: 48,
    fontSize: 18,
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,122,255,1)",
    textAlign: "center"
  },
  geoContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 34 : 10,
    left: 0,
    right: 0
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0
  },
  sliderWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(0,122,255,1)"
  },
  activeWrap: {
    alignSelf: "center",
    backgroundColor: "rgba(0,122,255,1)",
    borderRadius: 100,
    padding: 10
  }
});

export default connect(null, actions)(MapScreen);
