import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { loginUser } from '../api/index';



const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!email.toLowerCase()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async() => {
    // if (!validateForm()) {
    //   Alert.alert("Validation Error", "Please fix the errors before submitting.");
    //   return;
    // }

    // try {
    //   const response = await loginUser({
    //     email: email,
    //     password: password
    //   });
    //   console.log(response)
    //   Alert.alert("Success", "Logged in successfully!");
      navigation.replace("TwoStepVerification",{email});
    // } catch (err) {
    //   console.log(err)
    //   Alert.alert("Error", err.response?.data?.error || 'Login failed');
    // }
  };
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword"); // Make sure this route exists in your navigator
  };

  const handleNewUser = () => {
    navigation.navigate("SignUp");
  };
try{
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.mail_container}>
      <Ionicons
            name={"mail-outline"}
            size={24}
            color="#666"
          />
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Enter your email"
        value={email}
        placeholderTextColor="#fff" 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      /> 
     </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
     
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
      <Ionicons
            name={"lock-closed-outline"}
            size={24}
            color="#666"
          />
        <TextInput
          style={[ errors.password && styles.inputError,styles.input, { flex: 1 }]}
          placeholder="Enter your password"
          placeholderTextColor="#fff" 
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} 
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      {/* Sign IN */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      {/* Add Forgot Password Link Here */}
      <TouchableOpacity 
        onPress={handleForgotPassword} 
        style={styles.forgotPasswordContainer}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      {/* New User Sign Up */}
      <TouchableOpacity onPress={handleNewUser}>
        <Text style={styles.newUserText}>I'm a new user.<Text style={styles.signInLink}>Sign Up</Text> </Text>
      </TouchableOpacity>
    </View>
  );
}catch(err) {
  console.error('Render error:', err);
  return <Text style={{ color: 'red' }}>Something went wrong!</Text>;
}}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#161622",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  mail_container:{
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom:20,
    alignItems: "center",
    borderColor: "#ccc",
    
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    marginTop:18,
    color: "#A2A2A7",
  },
  input: {
    height: 50,
    color:"#fff"
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop:20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPasswordContainer: {
    alignSelf: 'center',
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  newUserText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  signInLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },

});

export default SignInScreen;