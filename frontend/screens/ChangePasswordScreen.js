import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet  } from "react-native";
import { changePassword } from '../api/index';



const ChangePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async() => {
    setLoading(true);
    try {
      // Basic validation
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError("All fields are required");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError("New passwords must match");
        return;
      }

      if (newPassword === currentPassword) {
        setError("New password must be different from current password");
        return;
      }
      console.log("en cour...")
      const response = await changePassword({
        currentPassword:currentPassword,
        newPassword:newPassword,
        confirmPassword:confirmPassword
      });
      console.log(response)
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      navigation.goBack();
    } catch (error) {
      setError(error.message || "Failed to change password. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      {/* Current Password Input */}
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        placeholderTextColor="#888888"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* New Password Input */}
      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        placeholderTextColor="#888888"
        onChangeText={setNewPassword}
      />

      {/* Confirm New Password Input */}
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        placeholderTextColor="#888888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Change Password Button */}
      
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
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
    marginTop:18,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChangePasswordScreen;