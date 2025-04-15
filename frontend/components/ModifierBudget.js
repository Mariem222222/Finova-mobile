import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,Image } from "react-native";
import CustomSlider from "../helper/CustomSlider";

const ModifierBudget = ({ navigation, route }) => {
  const { budget } = route.params || {};

  const [title, setTitle] = useState(budget?.title || "");
  const [currentAmount, setCurrentAmount] = useState(budget?.currentAmount || 0);
  const [targetAmount, setTargetAmount] = useState(budget?.targetAmount || 0);
  const [type, setType] = useState(budget?.type || "Epargne");
  const [description, setDescription] = useState(budget?.description || "");
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

  const handleSubmit = () => {
    setIsSuccessPopupVisible(true); 
  };

  const closePopup = () => {
    setIsSuccessPopupVisible(false);
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
       Modifier le Budget
      </Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Titre (e.g., Achat Immobilier)"
        value={title}
        placeholderTextColor="#888888"
        onChangeText={setTitle}
      />

      {/* Current Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Montant Actuel"
        keyboardType="numeric"
        value={currentAmount.toString()}
        placeholderTextColor="#888888"
        onChangeText={(text) => setCurrentAmount(Number(text))}
      />

      {/* Target Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Montant Cible"
        keyboardType="numeric"
        placeholderTextColor="#888888"
        value={targetAmount.toString()}
        onChangeText={(text) => setTargetAmount(Number(text))}
      />

      {/* Type Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Type (e.g., Epargne, Budget Personnel)"
        value={type}
        onChangeText={setType}
      />

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Amount Slider */}
      <Text style={styles.amountText}>Amount: ${currentAmount.toFixed(2)}</Text>
      <View style={styles.amount_Container}>
      <CustomSlider
        minValue={0}
        maxValue={10000}
        step={100}
        onValueChange={setCurrentAmount}
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
        <Text style={styles.addButtonText}>Modifier</Text>
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
               Modification Réussie
            </Text>
            <Text style={styles.popupText}>
          Le budget a été modifié avec succès.
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