import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ManualEntryScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Entry</Text>
      <Text style={styles.subtitle}>
        Choose whether you will enter dépenses information or revenue information.
      </Text>
      
      {/* Revenue Option */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RevenueForm')}>
        <Text style={styles.buttonText}>Income</Text>
      </TouchableOpacity>
      
      {/* Dépense Option */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExpenseForm')}>
        <Text style={styles.buttonText}>Expenses</Text>
      </TouchableOpacity>

      {/* Loan Option */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoanForm')}>
        <Text style={styles.buttonText}>Loan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#A2A2A7",
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0F62FE",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: 'center',
  },
});

export default ManualEntryScreen;