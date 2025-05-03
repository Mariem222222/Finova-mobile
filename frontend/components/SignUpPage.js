import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { registerUser } from '../api/index';

const SignUpPage = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!fullName) {
      errors.fullName = "Full Name is required.";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{8}$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone Number is invalid.";
    }

    if (!email) {
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

  const handleSignUp = async () => {  // Make this async directly
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await registerUser({
        name: fullName,
        phone:phoneNumber,
        email: email,
        password: password,
        phoneNumber: phoneNumber // Add this if your backend expects it
      });
      
      Alert.alert("Success", "User registered successfully!");
      console.log('Submitting:', { fullName, email, password, phoneNumber });
      navigation.replace("SignIn");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || 'Registration failed');
    }
  };


  const handleAlreadyHaveAccount = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>

    {/* Title */}
    <Text style={styles.title}>Sign Up</Text>

    {/* Full Name Input */}
    <Text style={styles.label}>Full Name</Text>
    <View style={styles.inputContainer}>
      <Ionicons name="person-outline" size={20} style={styles.icon} />
      <TextInput
        placeholder="Full Name"
        value={fullName}
        placeholderTextColor="#888888"
        onChangeText={setFullName}
        style={styles.input}
      />
    </View>
    {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

    {/* Phone Number Input */}
    <Text style={styles.label}>Phone Number</Text>
    <View style={styles.inputContainer}>
      <Ionicons name="call-outline" size={20} style={styles.icon} />
      <TextInput
        placeholder="Phone Number"
        placeholderTextColor="#888888"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        style={styles.input}
      />
    </View>
    {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

    {/* Email Address Input */}
    <Text style={styles.label}>Email Address</Text>
    <View style={styles.inputContainer}>
      <Ionicons name="mail-outline" size={20} style={styles.icon} />
      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#888888"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
        style={styles.input}
      />
    </View>
    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

    {/* Password Input */}
    <Text style={styles.label}>Password </Text>
    <View style={styles.inputContainer}>
      <Ionicons name="lock-closed-outline" size={20} style={styles.icon} />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#888888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
        style={styles.input}
      />
      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
        <Ionicons
          name={passwordVisible ? "eye-off-outline" : "eye-outline"}
          size={20}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

    {/* Sign Up Button */}
    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
      <Text style={styles.buttonText}>Sign Up</Text>
    </TouchableOpacity>

    {/* Already have an account? Sign In */}
    
    <TouchableOpacity onPress={handleAlreadyHaveAccount}>
    <Text style={styles.alreadyHaveAccountText}>
      Already have an account?{" "}
      <Text style={styles.signInLink}>Sign In</Text>
    </Text>
      </TouchableOpacity>
   
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 20,
   
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    marginTop:18,
    color: "#A2A2A7",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
    marginLeft:5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#333333",
  },

  input: {
    flex: 1,
    fontSize: 13,
    color: "#FFFFFF",
    marginLeft: 10,
  },
  icon: {
    color: "#888888",
  },
  button: {
    backgroundColor: "#007AFF", 
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  alreadyHaveAccountText: {
    textAlign: "center",
    color: "#333",
    marginTop: 30,
    fontSize: 14,
  },
  signInLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default SignUpPage;