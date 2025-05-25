// ResetPasswordScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { resetPassword } from '../api/index';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!code) errors.code = "Verification code is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords must match";
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      await resetPassword({
        email,
        code,
        newPassword
      });
      
      Alert.alert("Success", "Password reset successfully!");
      navigation.navigate("SignIn");
    } catch (error) {
      Alert.alert("Error", error.message || "Password reset failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      {/* Verification Code Input */}
      <Text style={styles.label}>Verification Code</Text>
      <TextInput
        style={[styles.input, errors.code && styles.inputError]}
        placeholder="Enter 6-digit code"
        placeholderTextColor="#888888"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />
      {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}

      {/* New Password Input */}
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={[styles.input, errors.newPassword && styles.inputError]}
        placeholder="Enter new password"
        placeholderTextColor="#888888"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm new password"
        placeholderTextColor="#888888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

// Keep similar styles from previous screens
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#161622",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 2,
    marginTop: 18,
    color: "#A2A2A7",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#333333",
    padding: 15,
    marginBottom: 10,
    color: "#fff",
  },
  inputError: {
    borderColor: "#FF3F60",
  },
  errorText: {
    color: "#FF3F60",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;