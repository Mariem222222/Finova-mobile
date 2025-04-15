import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; 

const ManagementScreen = ({ navigation }) => {
  const [budgets, setBudgets] = useState([
    {
      id: "1",
      title: "Achat Immobilier",
      currentAmount: 3300,
      targetAmount: 25000,
      type: "Epargne",
      lastUpdated: "1 min",
      description: "You can save more money by having less money by 10% of house dépenses",
    },
    {
      id: "2",
      title: "Budget Familial",
      currentAmount: 5400,
      targetAmount: 6000,
      type: "Budget Personnel",
      lastUpdated: "1 min",
      description: "You can save more money by having less money by 2% giving to your daughter",
    },
    {
      id: "3",
      title: "Vacances",
      currentAmount: 300,
      targetAmount: 5000,
      type: "Epargne",
      lastUpdated: "1 min",
      description: "You can save more money by having less money by 5% dépenses on shopping",
    },
    {
      id: "4",
      title: "Budget electromenager",
      currentAmount: 4200,
      targetAmount: 10000,
      type: "Budget Personnel",
      lastUpdated: "1 moin",
      description: "Save money on appliances",
    },
  ]);

  const handleUpdateBudget = (updatedBudget) => {
    setBudgets(
      budgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
        )
        );
      };
      const navigateToAddBudget = (budget) => {
        navigation.navigate("AddBudget")
      };
      const navigateToModifyBudget = (budget) => {
        navigation.navigate("ModifierBudget")
      };

      const getIconForBudget = (title) => {
        switch (title) {
          case "Achat Immobilier":
            return require('../assets/house.png'); 
          case "Budget Familial":
            return require('../assets/rent.png'); 
          case "Vacances":
            return require('../assets/spotify.png'); 
          case "Budget electromenager":
            return require('../assets/revenue.png'); 
          default:
            return null; 
        }
      };

      return (
        <ScrollView style={styles.container}>
      {/* Header  */}
          {/* Budget/Saving Cards */}
          {budgets.map((budget) => (
            <View key={budget.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Image source={getIconForBudget(budget.title)} style={styles.budgetIcon} />
                <View>
                  <Text style={styles.cardTitle}>{budget.title}</Text>
                  <Text style={styles.cardSubtitle}>{budget.type}</Text>
                </View>
                <View style={styles.lastUpdatedContainer}>
                  <Text style={styles.lastUpdatedText}>mis a jour il y a {budget.lastUpdated}</Text>
                  <Text style={styles.amountText}>${budget.currentAmount}</Text>
                </View>
              </View>
              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(Math.min(budget.currentAmount, budget.targetAmount) / budget.targetAmount) * 100}%` },
                  ]}
                  />
              </View>

              {/* Amounts */}
              <View style={styles.amountContainer}>
                <Text style={styles.amountStartText}>$0</Text>
                <Text style={styles.amountEndText}>${budget.targetAmount}</Text>
              </View>

              {/* Description with icon */}
              <View style={styles.descriptionContainer}>
                <Icon name="warning-outline" size={16} color="#9370DB" />
                <Text style={styles.description}>{budget.description}</Text>
              </View>

              {/* Modify Button */}
              <TouchableOpacity
                style={styles.modifyButton}
                onPress={() => navigateToModifyBudget(budget)}
                >
                <Text style={styles.modifyButtonText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigateToAddBudget(null)}
            >
            <Text style={styles.addButtonText}>Add +</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622', 
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E1E2D", 
    borderRadius: 10, 
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountText:{
    color:"#02BC77",
  },
  budgetIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff", 
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#A2A2A7", 
  },
  lastUpdatedContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  lastUpdatedText: {
    fontSize: 10,
    color: "#A2A2A7",
    marginBottom: 4,
  },
  progressBar: {
    height: 6, 
    backgroundColor: "#39394A", 
    borderRadius: 3,
    overflow: 'hidden', 
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#73F59F", 
    borderRadius: 3,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  amountStartText: {
    fontSize: 12,
    color: "#A2A2A7", 
  },
  amountEndText: {
    fontSize: 12,
    color: "#A2A2A7",
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 12,
    color: "#A2A2A7", 
    marginLeft: 5,
  },
  modifyButton: {
    backgroundColor: "#007AFF", 
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modifyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: '500'
  },
  addButton: {
    backgroundColor: "#007AFF", 
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ManagementScreen;