import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Button, Icon } from "react-native-elements";

const SCREEN_WIDTH = Dimensions.get("window").width;

class Slides extends Component {
  renderLastSlide(i) {
    if (i === this.props.data.length - 1) {
      return (
        <Button
          buttonStyle={styles.buttonStyle}
          title="Let's Do This!"
          iconRight
          onPress={this.props.onComplete}         
        />
      );
    } else {
      return (
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            alignItems: 'center'
          }}>
          <Text style={styles.swipe}>Swipe that way ➡</Text>
        </View>
      );
    }
  }
  renderSlides() {
    return this.props.data.map((slide, index) => {
      return (
        <View
          key={slide.text}
          style={[styles.slideStyle, { backgroundColor: slide.color }]}>
          <Text style={styles.slideText}>{slide.text}</Text>
          {this.renderLastSlide(index)}
        </View>
      );
    });
  }
  render() {
    return (
      <ScrollView horizontal style={{ flex: 1 }} pagingEnabled>
        {this.renderSlides()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slideStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
    paddingHorizontal: 15
  },
  slideText: {
    fontSize: 30,
    textAlign: "center",
    color: "#fff"
  },
  buttonStyle: {
    backgroundColor: "#03a9f4",
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'white'
  },
  swipe: {
    color: "white",
    marginRight: 7
  }
});

export default Slides;
