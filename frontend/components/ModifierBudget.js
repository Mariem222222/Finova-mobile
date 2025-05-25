import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, ActivityIndicator } from "react-native";
import CustomSlider from "../helper/CustomSlider";
import { ModifyBudget } from '../api/index';
import { Picker } from "@react-native-picker/picker";

const ModifierBudget = ({ navigation, route }) => {
  const { budget } = route.params || {};
  const initialDate = budget?.targetDate ? new Date(budget.targetDate) : new Date();
  
  // États pour la gestion des dates
  const [day, setDay] = useState(initialDate.getDate().toString());
  const [month, setMonth] = useState((initialDate.getMonth() + 1).toString());
  const [year, setYear] = useState(initialDate.getFullYear().toString());

  // État global du formulaire
  const [formData, setFormData] = useState({
    title: budget?.title || '',
    targetAmount: budget?.targetAmount?.toString() || '0',
    currentAmount: budget?.currentAmount?.toString() || '0',
    type: budget?.type || '',
    description: budget?.description || '',
    priority: budget?.priority?.toString() || '1'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  // Validation de la date
  const validateDate = () => {
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (isNaN(dayNum)) return "Jour invalide";
    if (isNaN(monthNum)) return "Mois invalide";
    if (isNaN(yearNum)) return "Année invalide";
    
    const newDate = new Date(yearNum, monthNum - 1, dayNum);
    if (isNaN(newDate.getTime())) return "Date invalide";
    
    const currentDate = new Date();
    if (newDate <= currentDate) return "La date doit être dans le futur";
    
    return null;
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validation
    const dateError = validateDate();
    if (dateError) {
      setError(dateError);
      setLoading(false);
      return;
    }

    if (!formData.title || !formData.targetAmount) {
      setError("Veuillez remplir les champs obligatoires");
      setLoading(false);
      return;
    }

    try {
      const updatedBudget = {
        ...budget,
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        priority: parseInt(formData.priority, 10),
        targetDate: new Date(
          parseInt(year, 10),
          parseInt(month, 10) - 1,
          parseInt(day, 10)
        ).toISOString(),
        lastUpdated: new Date().toISOString()
      };

      await ModifyBudget(updatedBudget);
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
      <Text style={styles.title}>Modifier le budget</Text>

      {/* Titre */}
      <TextInput
        style={styles.input}
        placeholder="Titre"
        value={formData.title}
        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
      />

      {/* Type de budget */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          style={styles.picker}>
          <Picker.Item label="Sélectionnez un type" value="" />
          {["Fond d'urgence", "Vacances", "Maison", "Voiture", "Autre"].map(opt => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>

      {/* Priorité */}
      <TextInput
        style={styles.input}
        placeholder="Priorité (1 = highest)"
        keyboardType="numeric"
        value={formData.priority}
        onChangeText={(text) => setFormData(prev => ({ ...prev, priority: text }))}
      />

      {/* Montant actuel avec slider */}
      <Text style={styles.amountText}>Montant actuel: ${formData.currentAmount}</Text>
      <View style={styles.amount_Container}>
        <CustomSlider
          minValue={0}
          maxValue={10000}
          step={10}
          value={parseFloat(formData.currentAmount) || 0}
          onValueChange={(value) => setFormData(prev => ({ ...prev, currentAmount: value.toString() }))}
        />
        <View style={styles.amountLabels}>
          <Text style={styles.amountLabel}>$0</Text>
          <Text style={styles.amountLabel}>$5,000</Text>
          <Text style={styles.amountLabel}>$10,000</Text>
        </View>
      </View>

      {/* Date cible */}
      <View style={styles.dateInputContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="JJ"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="MM"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="AAAA"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
      </View>

      {/* Description */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={formData.description}
        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleSubmit}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Enregistrer les modifications</Text>
        )}
      </TouchableOpacity>

      {/* Popup de succès */}
      <Modal
        visible={isSuccessPopupVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePopup}>
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Modification réussie!</Text>
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
   pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: '#333333',
  },
  picker: {
    color: '#888888'
  },
  dateInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  dateInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#333333',
    color: '#fff',
    textAlign: 'center',
    padding: 8
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