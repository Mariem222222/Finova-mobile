import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Dimensions } from "react-native";

const CustomSlider = ({ minValue = 0, maxValue = 10000, step = 1, onValueChange }) => {
  const [value, setValue] = useState(minValue);
  const sliderWidth = Dimensions.get("window").width - 40; 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newValue = Math.min(
          maxValue,
          Math.max(minValue, (gestureState.moveX / sliderWidth) * maxValue)
        );
        setValue(Math.round(newValue / step) * step);
        onValueChange(Math.round(newValue / step) * step);
      },
    })
  ).current;

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${(value / maxValue) * 100}%` }]}
        />
      </View>
      <View
        style={[styles.thumb, { left: `${(value / maxValue) * 100}%` }]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginVertical: 20,
  },
  track: {
    height: 5,
    backgroundColor: "#292937",
    borderRadius: 2,
    position: "relative",
  },
  fill: {
    height: 4,
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    height: 20,
    borderColor:"#0066FF",
    borderWidth:4,
    backgroundColor:"#fff",
    borderRadius: 10,
    position: "absolute",
    top: -8,
    transform: [{ translateX: -10 }],
  },
  valueText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default CustomSlider;