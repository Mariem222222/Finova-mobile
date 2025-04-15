import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const OnboardingPage = ({ image,titre,descriptions}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.titre}>{titre}</Text> 
      <Text style={styles.description}>{descriptions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#161622",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 60,
  },
  titre: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#7E848D",
  },
});

export default OnboardingPage;