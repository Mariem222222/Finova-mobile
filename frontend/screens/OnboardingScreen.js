import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import OnboardingPage from "../components/OnboardingPage";

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const handleGetStarted = () => {
    navigation.replace("SignIn"); 
  };

  const handleNext = () => {
    if (currentIndex < 2) {
      swiperRef.current.scrollBy(1);
    }
  };

  const swiperRef = React.useRef(null); 

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination
        activeDotStyle={styles.activeDot}
        onIndexChanged={(index) => setCurrentIndex(index)} 
      >
        <OnboardingPage
          image={require("../assets/onboarding1.png")}
          titre="Fastest Payment in the World"
          descriptions="The most secure platform for customer payments."
          backgroundColor="#161622"
          titleColor="#FFFFFF"
          descriptionColor="#666"
        />

        <OnboardingPage
          image={require("../assets/onboarding2.png")}
          titre="Paying for Everything is Easy"
          descriptions="Integrate multiple payment methods to help you speed up the process."
          backgroundColor="#1E1E2D"
          titleColor="#FFD700"
          descriptionColor="#A9A9A9"
        />

        <OnboardingPage
          image={require("../assets/onboarding3.png")}
          titre="Built-in Security Features"
          descriptions="Fingerprint, face recognition, and more to keep you secure."
          backgroundColor="#2C2C3A"
          titleColor="#00FF00"
          descriptionColor="#CCCCCC"
        />
      </Swiper>

      <View style={styles.buttonContainer}>
        {currentIndex < 2 ? ( 
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#161622",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: "center", 
  },
  button: {
    backgroundColor: "#0066FF", 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15, 
    alignItems: "center",
    justifyContent: "center",
    width: "98%", 
  },
  buttonText: {
    color: "#FFFFFF", 
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;