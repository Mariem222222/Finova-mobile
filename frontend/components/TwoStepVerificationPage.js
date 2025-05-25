import React, { useState, useEffect,useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CODE_LENGTH = 6;
import { verifyTwoFACode } from "../api/index";
const TwoStepVerificationScreen = ({ route,navigation }) => {
  const {email}=route.params;
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const [countdown, setCountdown] = useState(30); 

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendDisabled]);


  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
    }
  };


    const handleSubmit = async () => {
      // if (code.every(digit => digit !== "") && code.length === CODE_LENGTH) {
      // try{
      //   const response = await verifyTwoFACode({ email: email, code: code.join("") });
      // console.log("Verification response:", response);
      // const token = response.token;
      // // Save to AsyncStorage
      // await AsyncStorage.setItem('token', token);
      // console.log(response);
     
      Alert.alert("success","Login Successful !");
        navigation.replace("MainApp");
  //   } 
  //   catch (error) {
  //     console.log("Verification Error:", error?.response?.data || error.message || error);
  //     Alert.alert("Error", "An error occurred. Please try again.");
  //   }
  // }else{
  //   Alert.alert("You must fille the 2FA code"); 
  // }
}
    
    

    const handleResendCode = async () => {
      setResendDisabled(true);
      setCountdown(30);
      setCode(Array(CODE_LENGTH).fill(""));
      inputRefs.current[0].focus();
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Two Step Verification</Text>
      <Text style={styles.subtitle}>
        Enter the six digit code generated and sent to your email
      </Text>
      <View style={styles.codeContainer}>
        {Array(CODE_LENGTH).fill(0).map((_, index) => (
          <TextInput
            key={index}
            ref={ref => inputRefs.current[index] = ref}
            style={styles.codeInput}
            value={code[index]}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            selectionColor="#0066FF"
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.button, !code.every(digit => digit !== "") && styles.buttonDisabled]}
        onPress={handleSubmit}
      
        >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResendCode}
        disabled={resendDisabled}
        style={resendDisabled ? styles.resendButtonDisabled : styles.resendButton}
      >
        <Text style={resendDisabled ? styles.resendTextDisabled : styles.resendText}>
          {resendDisabled ? `Resend Code in ${countdown}s` : "Resend Code"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
    backgroundColor: "#161622",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  codeInput: {
    width: 45,
    height: 60,
    borderWidth: 1,
    borderColor: '#0066FF',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    backgroundColor: 'transparent',
  },
 
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop:30,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendButton: {
    alignItems: "center",
  },
  resendButtonDisabled: {
    alignItems: "center",
    opacity: 0.5,
  },
  resendText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  resendTextDisabled: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
});

export default TwoStepVerificationScreen;