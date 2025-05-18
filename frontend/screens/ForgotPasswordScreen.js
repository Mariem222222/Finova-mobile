import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { sendResetEmail } from '../api/index';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!email) {
        setError("Email is required");
        return;
      }
      
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Invalid email format");
        return;
      }

      const response = await sendResetEmail({ email });
      Alert.alert("Success", "Password reset instructions sent to your email!");
      navigation.navigate("ResetPassword", { email });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your registered email"
        placeholderTextColor="#888888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Submit Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF3F60",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;