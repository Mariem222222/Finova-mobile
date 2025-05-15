import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,Image } from "react-native";
import CustomSlider from "../helper/CustomSlider"
import { postTransactions } from '../api/index';
const LoanForm = ({ navigation }) => {
 const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [amount, setAmount] = useState(0);
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
    const allowedCategories = [
      'transfer',
      'withdrawal',
      'payment',
    ];
    const validateCategory = (input) => {
      if (!allowedCategories.includes(input.toLowerCase())) {
        setCategoryError('Invalid category. Allowed values: transfer, withdrawal');
        return false;
      }
      setCategoryError('');
      return true;
    };
  
    const handleSubmit = async () => {
      setCategoryError('');
      // Validate category
      if (!validateCategory(category)) {
        return;
      }
      if (!description || amount <= 0) {
        alert("Please fill all required fields");
        return;
      }
      try {
        const transactionData = {
          amount:Number(amount),
          type:"loan",
          description:description,
          category: category
        };
        console.log(transactionData)
        await postTransactions(transactionData);
        setIsSuccessPopupVisible(true);  
      } catch (error) {
        console.error("Transaction error:", error);
        alert(`Transaction failed: ${error.error || error.message}`);
      }
    };
  
    const closePopup = () => {
      setIsSuccessPopupVisible(false);
      navigation.goBack(); 
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add A New Loan </Text>

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Type What is the loan (e.g., Car Loan, Home Loan)"
        value={description}
        onChangeText={setDescription}
      />

      {/* Category Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
         placeholder="Valid categories: transfer, payment, withdrawal"
        value={category}
        onChangeText={(text) => {
          setCategory(text.toLowerCase());
          validateCategory(text);
        }}
      />

      {/* Amount Slider */}
      <Text style={styles.amountText}>Amount: ${amount.toFixed(2)}</Text>
      <View style={styles.amount_Container}>
      {/* Custom Slider */}
      <CustomSlider
        minValue={0}
        maxValue={10000}
        step={100}
        onValueChange={setAmount}
        minimumTrackTintColor="#0066FF"
        maximumTrackTintColor="#A2A2A7"
      />

      <View style={styles.amountLabels}>
        <Text style={styles.amountLabel}>$0</Text>
        <Text style={styles.amountLabel}>$4,600</Text>
        <Text style={styles.amountLabel}>$10,000</Text>
      </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add +</Text>
      </TouchableOpacity>

      {/* Success Popup */}
      <Modal
        visible={isSuccessPopupVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePopup}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Ajout Avec Success</Text>
            <Text style={styles.popupText}>
              Le Loan <Text style={styles.boldText}>{description}</Text> dans la catégorie{" "}
              <Text style={styles.boldText}>{category}</Text> a été ajouté avec success.
            </Text>
           <Image source={require("../assets/done.png")} style={styles.popup_image} />
            <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap:12,
    padding:25,
    backgroundColor: "#161622",
  },
  title: {
    fontSize: 24,
    textAlign:"center",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#333333",
    marginBottom: 20,
    color: "#fff",
  },
  amount_Container:{
    backgroundColor:"#1E1E2D",
    borderRadius:20,
    paddingHorizontal:25,
    paddingVertical:10,
  },
  amountText: {
    fontSize: 16,
    color: "#fff",
  },
  amountLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: {
    fontSize: 14,
    color: "#A2A2A7",
  },
  addButton: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 8,
    marginTop:50,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "#1E1E2D",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  popupText: {
    fontSize: 16,
    color: "#A2A2A7",
    marginBottom: 10,
    textAlign: "center",
  },
  popup_image:{
    width: 40, 
    height: 40,
    borderRadius: 50,
    marginBottom:10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#8402BC",
  },
  popupSubtext: {
    fontSize: 14,
    color: "#A2A2A7",
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: "#0066FF",
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoanForm;