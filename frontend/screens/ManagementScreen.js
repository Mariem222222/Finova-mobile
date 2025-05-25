import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchBudgets } from '../api/index';
import { deleteBudget } from '../api/index';
import { useIsFocused } from '@react-navigation/native';

const ManagementScreen = ({ navigation }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFocused = useIsFocused();

  // Trouver le budget prioritaire
  const priorityBudget = budgets.find(b => b.priority === 1);
  const remainingBudgets = budgets.filter(b => b.priority !== 1);

  useEffect(() => {
    if (isFocused) {
      const handlefetchBudgets = async () => {
        try {
          setLoading(true);
          const data = await fetchBudgets();
          setBudgets(data.sort((a, b) => a.priority - b.priority));
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      handlefetchBudgets();
    }
  }, [isFocused]);
 const handleDeleteBudget = async (budgetId) => {
  try {
    setLoading(true);
    await deleteBudget(budgetId);
    // Refresh the list after successful deletion
    const data = await fetchBudgets();
    setBudgets(data.sort((a, b) => a.priority - b.priority));
    setLoading(false);
  } catch (error) {
    setLoading(false);
    Alert.alert('Error', 'Failed to delete budget. Please try again.');
    console.error('Deletion error:', error);
  }
};
      const navigateToAddBudget = () => {
        navigation.navigate("AddBudget")
      };
      const navigateToModifyBudget = (budget) => {
        navigation.navigate("ModifierBudget", { budget: budget });
      };


  const calculateProgress = (current, target) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
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
            return require('../assets/revenue.png'); 
        }
      };

  const calculateTimeLeft = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;

    if (diff < 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h left`;
  };

  const renderBudgetCard = (budget, isPriority = false) => {
    const progress = calculateProgress(budget.currentAmount, budget.targetAmount);
    const timeLeft = calculateTimeLeft(budget.targetDate);

    return (
      <View key={budget._id} style={[styles.card, isPriority && styles.priorityCard]}>
        <View style={styles.cardHeader}>
          <Image source={getIconForBudget(budget.title)} style={styles.budgetIcon} />
          <View>
            <Text style={styles.cardTitle}>{budget.title}</Text>
            <Text style={styles.cardSubtitle}>{budget.type}</Text>
          </View>
          <View style={styles.lastUpdatedContainer}>
            <TouchableOpacity onPress={() => handleDeleteBudget(budget._id)} style={styles.deleteButton}>
              <Icon name="close-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
            <Text style={styles.lastUpdatedText}>Last updated: {new Date(budget.lastUpdated).toLocaleDateString()}</Text>
            <Text style={styles.amountText}>${budget.currentAmount.toFixed(2)}</Text>
          </View>
        </View>

         {/* Progress Bar Fix */}
        <View style={styles.progressWrapper}>
           <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: isPriority ? '#34D399' : '#73F59F'
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountStartText}>$0</Text>
          <Text style={styles.amountEndText}>${budget.targetAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.timeLeftBadge}>
            <Icon name="time-outline" size={14} color="#9370DB" />
            <Text style={styles.timeLeftText}>{timeLeft}</Text>
          </View>
          <View style={styles.statusLeftBadge}>
            <Icon name="time-outline" size={14} color="#9370DB" />
            <Text style={styles.timeLeftText}>
              {budget.status === 'pending' ? 'Pending' : 'Expiré'}
              </Text>
            {/* <Text style={styles.timeLeftText}>{timeLeft}</Text> */}
          </View>
          <TouchableOpacity
            style={[styles.modifyButton, isPriority && styles.priorityButton]}
            onPress={() => navigateToModifyBudget(budget)}>
            <Text style={styles.modifyButtonText}>Modify</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchBudgets}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {priorityBudget && renderBudgetCard(priorityBudget, true)}
      
      {remainingBudgets.map(budget => renderBudgetCard(budget))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigateToAddBudget()}>
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
  deleteButton: {
    padding: 4,
  },
   priorityCard: {
    borderWidth: 2,
    borderColor: '#34D399',
    marginBottom: 24
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
   progressWrapper: {
    marginVertical: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D2D3A',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    position: 'absolute',
    right: 10,
    top: -2,
    color: '#FFF',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  timeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    color: '#73F59F',
    fontSize: 12,
    marginBottom:10,
    fontWeight: '500'
  },
  statusLeftBadge: {
    flexDirection: 'row',
    alignItems: 'left',
    backgroundColor: '#2E2E3D',
    padding: 6,
    borderRadius: 20,
    
  },
  timeLeftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E2E3D',
    padding: 6,
    borderRadius: 20,
    gap: 2
  },
  timeLeftText: {
    color: '#9370DB',
    fontSize: 12
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  priorityButton: {
    backgroundColor: '#34D399'
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
    paddingHorizontal:10,
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
    marginBottom: 35,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
   center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManagementScreen;