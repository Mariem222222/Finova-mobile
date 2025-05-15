import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,Image  } from "react-native";
import CustomSlider from "../helper/CustomSlider";
import {ModifyBudget} from '../api/index';

const ModifierBudget = ({ navigation, route }) => {
  const { budget } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
  title: budget?.title || '',
  currentAmount: budget?.currentAmount || 0,
  targetAmount: budget?.targetAmount || 0,
  type: budget?.type || '',
  description: budget?.description || '',
  });
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedBudget = {
        ...budget,
        ...formData,
        lastUpdated: new Date().toISOString()
      };

      // Call the update callback from parent
      const newBudget = await ModifyBudget(updatedBudget);
      console.log("budget updated to : ",newBudget)
      
      setIsSuccessPopupVisible(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  
  };

  const closePopup = () => {
    setIsSuccessPopupVisible(false);
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
       Modify The Budget
      </Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Title (Real Estate , ...)"
        value={formData.title}
        placeholderTextColor="#888888"
        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
      />

      {/* Current Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Current Amount"
        keyboardType="numeric"
        value={formData.currentAmount.toString()}
        placeholderTextColor="#888888"
        onChangeText={(text) => {
          const currentAmount = Number(text) || 0;
          setFormData(prev => ({ ...prev, currentAmount }));
        }}
      />

      {/* Target Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Target Amount"
        keyboardType="numeric"
        placeholderTextColor="#888888"
        value={formData.targetAmount.toString()}
        onChangeText={(text) => {
          const targetAmount = Number(text) || 0;
          setFormData(prev => ({ ...prev, targetAmount }));
        }}
      />

      {/* Type Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Type (Saving,Personal Budget)"
        value={formData.type}
        onChangeText={(text) => setFormData(prev => ({ ...prev, type: text }))}

      />

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
      />

      {/* Amount Slider */}
      <Text style={styles.amountText}>Amount: ${formData.currentAmount.toFixed(2)}</Text>
      <View style={styles.amount_Container}>
      <CustomSlider
        minValue={0}
        maxValue={10000}
        step={10}
        onValueChange={(value) => 
          setFormData(prev => ({ ...prev, currentAmount: value }))}
        minimumTrackTintColor="#0066FF"
        maximumTrackTintColor="#A2A2A7"
      />
      <View style={styles.amountLabels}>
        <Text style={styles.amountLabel}>$0</Text>
        <Text style={styles.amountLabel}>$4,600</Text>
        <Text style={styles.amountLabel}>$10,000</Text>
      </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {/* Submit Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.addButtonText}>Modify</Text>
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
            <Text style={styles.popupTitle}>
            Edited Successfuly
            </Text>
            <Text style={styles.popupText}>
          The budget was successfully Edited.
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
    paddingVertical:5,
  },
  amountText: {
    fontSize: 16,
    color: "#fff",
  },
  amountLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 10,
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
    color: "#fff",
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

export default ModifierBudget;