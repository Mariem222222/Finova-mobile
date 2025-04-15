import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 

const TransactionHistoryScreen = () => {
  const navigation = useNavigation();

  const transactions = [
    { 
      _id: '1', 
      description: 'Gift Card', 
      amount: -19.20, 
      imageUrl: require("../assets/giftcard.png"), 
      date: 'Today', 
      category: 'Shopping' 
    },
    { 
      _id: '2', 
      description: 'Car Insurance', 
      amount: -200, 
      imageUrl: require("../assets/car.png"), 
      date: 'Today', 
      category: 'Car' 
    },
    { 
      _id: '3', 
      description: 'House', 
      amount: -300, 
      imageUrl: require("../assets/house.png"), 
      date: 'Last 7 Days', 
      category: 'Cash' 

    },
    { 
      _id: '4', 
      description: 'cash', 
      amount: +300, 
      imageUrl: require("../assets/revenue.png"), 
      date: 'Last 7 Days', 
      category: 'Cash' 
    },
    { 
      _id: '5', 
      description: 'cash', 
      amount: -650, 
      imageUrl: require("../assets/revenue.png"), 
      date: 'Last 7 Days', 
      category: 'Cash' 
    },
    { 
      _id: '6', 
      description: 'cash', 
      amount: -650, 
      imageUrl: require("../assets/revenue.png"), 
      date: 'Last 7 Days', 
      category: 'Cash' 
    },
    { 
      _id: '7', 
      description: 'cash', 
      amount: +30, 
      imageUrl: require("../assets/revenue.png"), 
      date: 'Last 7 Days', 
      category: 'Cash' 
    },
  ];
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>
      {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <View key={index} style={styles.transactionItem}>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                  <View style={styles.transactionDetails}>
                  <Image source={typeof transaction.imageUrl === 'string' ? { uri: transaction.imageUrl } : transaction.imageUrl}
                    style={styles.transactionImage}/>
                   
                    <View styles={styles.textContainer}>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionType}>{transaction.category}</Text>
                    </View>
                    <View style={styles.felxcontainer}></View>
                    <View styles={styles.textContainer}>
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
              <Text>No transactions available</Text>
            )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 17,
    
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#161622",
  },
  add_img: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  felxcontainer:{
    flex:1,
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
  transactionDate: {
    fontSize: 16,
    color:'#fff',
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent:"flex-end",
    alignItems: "center", 
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
  transactionImage: {
    width: 25,
    height: 25,
    marginRight:20,
  },
  transactionItem: {
    marginBottom: 24,
  },
});

export default TransactionHistoryScreen;