import React, { Component } from "react";
import { View, Text, StyleSheet, Platform, Image } from "react-native";

import { connect } from "react-redux";
import * as actions from "../actions";

import { Icon, Card, Button } from "react-native-elements";
import { Constants, MapView } from "expo";
import Swipe from "../components/Swipe";
import { GOOGLE_KEY, URL } from "./Google";

class DeckScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Icon
            name="ios-list-box"
            type="ionicon"
            color={tintColor}
            size={36}
          />
        );
      } else {
        return (
          <Icon
            name="ios-list-box-outline"
            type="ionicon"
            color={tintColor}
            size={36}
          />
        );
      }
    }
  };
  // Generate a card for each job, use static Google map for image
  renderCard(job) {
    const latitude = job.latitude;
    const longitude = job.longitude;
    const fullUrl = `${URL}&center=${latitude},${longitude}&size=400x200`;
    const { jobtitle, company, formattedRelativeTime, snippet } = job;
    return (
      <Card
        title={
          jobtitle.length >= 26 ? jobtitle.substr(0, 26) + "..." : jobtitle
        }>
        <View style={{ height: 180 }}>
          <Image
            style={{ flex: 1 }}
            source={{ uri: fullUrl }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.detailWrap}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            {company.length > 25 ? company.substr(0, 25) + "..." : company}
          </Text>
          <Text>{formattedRelativeTime}</Text>
        </View>
        <Text>
          {snippet.replace(/<b>/g, "").replace(/<\/b>/g, "").substr(0, 80)}
        </Text>
      </Card>
    );
  }
  renderLikesButton = () => {
    if (this.props.likes.length > 0) {
      return (
        <View>
          <Text style={{ textAlign: "center", marginBottom: 4 }}>or</Text>
          <Button
            title="View Your Likes"
            onPress={() => this.props.navigation.navigate("review")}
            icon={{
              name: "ios-heart-outline",
              type: "ionicon",
              style: { fontSize: 30, color: "rgba(0,122,255,1)" }
            }}
            color="rgba(0,122,255,1)"
            backgroundColor="white"
            buttonStyle={{borderWidth: 2, borderColor: "rgba(0,122,255,1)"}}
          />
        </View>
      );
    }
  };
  renderNoMoreCards = () => {
    return (
      <Card title="Nothing to see here">
        <Button
          title="Search For Jobs"
          onPress={() => this.props.navigation.navigate("map")}
          icon={{
            name: "ios-locate-outline",
            type: "ionicon",
            style: { fontSize: 30 }
          }}
          backgroundColor="rgba(0,122,255,1)"
        />
        {this.renderLikesButton()}
      </Card>
    );
  };

  render() {
    return (
      <View style={{ marginTop: Constants.statusBarHeight }}>
        <Swipe
          data={this.props.jobs}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
          keyProp="jobkey"
          onSwipeRight={job => this.props.likeJob(job)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  detailWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    marginTop: 10
  }
});

function mapStateToProps({ job, likes }) {
  return {
    jobs: job.results,
    likes
  };
}
export default connect(mapStateToProps, actions)(DeckScreen);
