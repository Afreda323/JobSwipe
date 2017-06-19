import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  ScrollView,
  StyleSheet,
  Linking,
  Image,
  Share
} from "react-native";
import { Button, Card, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import { Constants } from "expo";
import { GOOGLE_KEY, URL } from "./Google";
import axios from "axios";
const BITLY = "e2bd361ce80223ea6056666a5674cacd0b4919e0";
class ReviewScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
      title: "Review Jobs",
      headerStyle: {
        marginTop: Platform.OS === "android" ? 24 : 0
      },
      tabBarIcon: ({ focused, tintColor }) => {
        if (focused) {
          return (
            <Icon name="ios-heart" type="ionicon" color={tintColor} size={36} />
          );
        } else {
          return (
            <Icon
              name="ios-heart-outline"
              type="ionicon"
              color={tintColor}
              size={36}
            />
          );
        }
      },
      headerRight: (
        <Button
          title="Settings"
          backgroundColor="rgba(0,0,0,0)"
          color="rgba(0,122,255,1)"
          onPress={() => navigate("settings")}
        />
      )
    };
  };
  // Share modulem generate a text message
  attemptShare(url, job, company) {
    Share.share({
      title: "Check out this job",
      message:
        `${job} at ${company}\n\n` + url + "\n\n" + "Job found with JobSwipe"
    })
      .then(res => {
        console.log(res);
      })
      .catch(e => console.error(e));
  }
  // Shorten job URL, then pass it to share module
  handleShare(url, job, company) {
    axios
      .get(
        `https://api-ssl.bitly.com/v3/shorten?access_token=${BITLY}&longUrl=${url}`
      )
      .then(res => {
        this.attemptShare(res.data.data.url, job, company);
      })
      .catch(error => {
        console.error(error);
        this.attemptShare(url, job, company);
      });
  }
  renderLikes() {
    if (this.props.likes.length > 0) {
      return this.props.likes.map(job => {
        const {
          jobkey,
          jobtitle,
          url,
          company,
          formattedRelativeTime,
          latitude,
          longitude
        } = job;
        const fullUrl = `${URL}&center=${latitude},${longitude}&size=800x200`;

        return (
          <Card title={jobtitle} key={jobkey}>
            <View style={{ height: 200 }}>
              <Image
                style={{ flex: 1 }}
                source={{ uri: fullUrl }}
                resizeMode="contain"
              />
              <View style={styles.detailWrap}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {company.length > 25
                    ? company.substr(0, 25) + "..."
                    : company}
                </Text>
                <Text>{formattedRelativeTime}</Text>
              </View>
              <View style={styles.detailWrap}>
                <Button
                  title="Apply"
                  backgroundColor="rgba(0,122,255,1)"
                  onPress={() => Linking.openURL(url)}
                  icon={{
                    name: "ios-clipboard-outline",
                    type: "ionicon",
                    style: { fontSize: 30 }
                  }}
                  buttonStyle={{
                      borderWidth: 2,
                    borderColor: "rgba(0,122,255,1)",
                    paddingHorizontal: 32
                  }}
                />
                <Button
                  title="Share"
                  onPress={() => this.handleShare(url, jobtitle, company)}
                  icon={{
                    name: "md-share",
                    type: "ionicon",
                    style: { fontSize: 30, color: "rgba(0,122,255,1)" }
                  }}
                  color="rgba(0,122,255,1)"
                  backgroundColor="white"
                  buttonStyle={{
                    borderWidth: 2,
                    borderColor: "rgba(0,122,255,1)",
                    paddingHorizontal: 32
                  }}
                />
              </View>
            </View>
          </Card>
        );
      });
    } else {
      return (
        <Card title="You Have No Liked Jobs">
          <Button
            title="Find Some Jobs"
            onPress={() => this.props.navigation.navigate("map")}
            icon={{
              name: "ios-locate-outline",
              type: "ionicon",
              style: { fontSize: 30 }
            }}
            backgroundColor="rgba(0,122,255,1)"
          />
        </Card>
      );
    }
  }

  render() {
    return (
      <ScrollView style={{ marginTop: Constants.statusBarHeight }}>
        {this.renderLikes()}
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  detailWrap: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-around",
  }
});

function mapStateToProps(state) {
  return {
    likes: state.likes
  };
}
export default connect(mapStateToProps)(ReviewScreen);
