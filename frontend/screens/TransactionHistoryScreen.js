import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getTransactions } from '../api/index'; // Adjust import path

const TransactionHistoryScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactionsData = async () => {
      try {
        const response = await getTransactions();
        const formattedTransactions = response.transactions.map(tx => ({
          ...tx,
          amount: tx.type === 'credit' ? tx.amount : -tx.amount,
        }));
        setTransactions(formattedTransactions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransactionsData();
  }, []);

  const getImageByCategory = (category) => {
    switch (category) {
      case 'Shopping':
        return require("../assets/giftcard.png");
      case 'Car':
        return require("../assets/car.png");
      case 'House':
        return require("../assets/house.png");
      default:
        return require("../assets/revenue.png");
    }
  };

  const formatDate = (dateString) => {
    const transactionDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - transactionDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays <= 7) {
      return 'Last 7 Days';
    } else {
      return transactionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
            <View style={styles.transactionDetails}>
              <Image
                source={getImageByCategory(transaction.category)}
                style={styles.transactionImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionType}>{transaction.category}</Text>
              </View>
              <View style={styles.felxcontainer}></View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: transaction.amount < 0 ? "#FF6B6B" : "#4ECDC4" },
                  ]}
                >
                  ${transaction.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noTransactionsText}>No transactions available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#161622",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  transactionItem: {
    marginBottom: 24,
  },
  transactionDate: {
    fontSize: 16,
    color: '#fff',
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  transactionImage: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  textContainer: {
    marginLeft: 10,
  },
  transactionDescription: {
    fontSize: 14,
    color: "#fff",
  },
  transactionType: {
    fontSize: 12,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
  },
  noTransactionsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TransactionHistoryScreen;