import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,Image,ActivityIndicator  } from "react-native";
import CustomSlider from "../helper/CustomSlider";
import {AddBudgets} from '../api/index';
import { Picker } from "@react-native-picker/picker";

const AddBudget = ({ navigation,budgets = [] }) => {
  const initialDate = new Date();
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(initialDate.getDate().toString());
  const [month, setMonth] = useState((initialDate.getMonth() + 1).toString());
  const [year, setYear] = useState(initialDate.getFullYear().toString());
  const [budget, setBudget] = useState({
    name: "",
    targetAmount: "",
    targetDate: initialDate,
    type:"",
    priority: 1
  });
  
// Separate handler for priority changes
  const handlePriorityChange = (text) => {
    const numericValue = parseInt(text, 10) || 0;

    setBudget(prev => ({
      ...prev,
      priority: numericValue
    }));
  };
  const [customGoal, setCustomGoal] = useState("");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
   
  useEffect(() => {
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (!isNaN(dayNum) && !isNaN(monthNum) && !isNaN(yearNum)) {
    const newDate = new Date(yearNum, monthNum - 1, dayNum);
    if (!isNaN(newDate.getTime())) {
      setBudget(prev => ({ 
        ...prev, 
        targetDate: newDate 
      }));
    }
  }
}, [day, month, year]); 

if (loading) {
        return (
          <View style={[styles.container, styles.center]}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        );
      }

const validateDate = () => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (isNaN(dayNum)) return "Invalid day";
    if (isNaN(monthNum)) return "Invalid month";
    if (isNaN(yearNum)) return "Invalid year";
    
    const newDate = new Date(yearNum, monthNum - 1, dayNum);
    if (isNaN(newDate.getTime())) return "Invalid date";
    
    const currentDate = new Date();
    if (newDate <= currentDate) return "Date must be in future";
    
    return null;
  };
  
   const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    // Validate inputs
    const dateError = validateDate();
    if (dateError) {
      setError(dateError);
      setLoading(false);
      return;
    }

    if ((!budget.name && !customGoal.trim()) || !budget.targetAmount) {
      setError("Please fill required fields");
      setLoading(false);
      return;
    }
    if ((!budget.priority )) {
      setError("Please fill priority");
      setLoading(false);
      return;
    }
    try {
      const newBudget = {
        name: budget.name || customGoal.trim(),
        targetAmount: parseFloat(budget.targetAmount),
        description:description,
        targetDate: budget.targetDate.toISOString(),
        type:budget.type.toString(),
        priority: Number(budget.priority) 
      };

      const createdBudget = await AddBudgets(newBudget);
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
         Add A New Budget
      </Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Title ( Real Estate Purchase,..)"
       value={budget.name}
        placeholderTextColor="#888888"
         onChangeText={(text) => {
                setCustomGoal(text);
                setBudget({ ...budget, name: text });
                }}
      />
      {/* Target Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Target Amount"
        keyboardType="numeric"
        placeholderTextColor="#888888"
        value={budget.targetAmount}
        onChangeText={text => setBudget(prev => ({
          ...prev,
          targetAmount: text
        }))}
      />

      {/* Type Input */}
      <View style={styles.pickerContainer}>
              <Picker
                selectedValue={budget.name}
                onValueChange={(value) => setBudget({ ...budget, type: value })}
                style={styles.picker}
              >
                <Picker.Item label="Select goal type" value=""  />
                {["Emergency Fund", "Vacation", "Home", "Car", "Other"].map(opt => (
                  <Picker.Item key={opt} label={opt} value={opt}  />
                ))}
              </Picker>
            </View>

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Amount Slider */}
      <Text style={styles.amountText}>Amount:$</Text>
      <View style={styles.amount_Container}>
      <CustomSlider
        minValue={0}
        maxValue={100000}
        step={10}
        value={parseFloat(budget.targetAmount) || 0}
        onValueChange={value => setBudget(prev => ({
          ...prev,
          targetAmount: value.toString()
        }))}
        minimumTrackTintColor="#0066FF"
        maximumTrackTintColor="#A2A2A7"
      />
      <View style={styles.amountLabels}>
        <Text style={styles.amountLabel}>$0</Text>
        <Text style={styles.amountLabel}>$100,000</Text>
        <Text style={styles.amountLabel}>$100,000,000</Text>
      </View>
      </View>
         {/* Date  pick */}
       <View style={styles.formGroup}>
    <Text style={styles.label}>Target Date</Text>
    <View style={styles.dateInputContainer}>
      <TextInput
        style={styles.dateInput}
        placeholder="DD"
        value={day}
        onChangeText={setDay}
        keyboardType="numeric"
        maxLength={2}
        placeholderTextColor="#888888"
      />
      <TextInput
        style={styles.dateInput}
        placeholder="MM"
        value={month}
        onChangeText={setMonth}
        keyboardType="numeric"
        maxLength={2}
        placeholderTextColor="#888888"
      />
      <TextInput
        style={styles.dateInput}
        placeholder="YYYY"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        maxLength={4}
        placeholderTextColor="#888888"
      />
    </View>
  </View>
             {/* Priority */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={String(budget.priority)}
              onChangeText={handlePriorityChange}
              placeholder="Enter priority (1 = highest)"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
      {/* Submit Button */}

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}disabled={loading}>
        <Text style={styles.addButtonText}> Add</Text>
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
               Ajout Réussi
            </Text>
            <Text style={styles.popupText}>
             Le budget a été ajouté avec succès.
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
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#333333",

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
   pickerContainer: {
    borderWidth:1,
    borderRadius:5,
    backgroundColor:"#1E1E2D",
    // borderBottomWidth:1,
    borderColor: '#333333',
    padding: 0,
  },
  picker:{
    color:'#888888'
  },

  amountLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: {
    fontSize: 14,
    color: "#A2A2A7",
  },
  dateInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
  },
  dateInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#333333',
    color: '#fff',
    textAlign: 'center',
    padding: 8,
  },
  addButton: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 8,
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
   center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddBudget;






   

     
            

         

         

         

        
