import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Profile from '../components/Profile';

const HomeScreen = () => {
  const [transactions, setTransactions] = useState([
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
  ]);
  const [balance, setBalance] = useState(8545);
  const [plannedBudget, setPlannedBudget] = useState(4000);
  const [actualExpenses, setActualExpenses] = useState(150);
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scrollContainer}>
      {/* Header Content */}
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <Profile name="Jawhar Soussia" profileImage={require("../assets/profile.jpg")} />
        </TouchableOpacity>
        <View style={styles.balance}>
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
          <Text style={styles.subText}>Current Balance</Text>
        </View>
        <View style={styles.first_container_scan}>
          <TouchableOpacity>
            <View style={styles.Second_Container_scan}>
              <Image source={require("../assets/add.png")} style={styles.add_img} />
              <Text style={styles.scanButtonText}>Scanner Invoice</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Middle Container with Budget and Expenses */}
        <View style={styles.middle_container}>
          {/* Budget and Expenses Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budget Prévisionnel</Text>
              <Text style={styles.statValue_budget}>${plannedBudget.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Dépenses Réel</Text>
              <Text style={styles.statValue_depence}>${actualExpenses.toFixed(2)}</Text>
            </View>
          </View>

          {/* Manual Add Section */}
          <View style={styles.ajout_container}>
            <Text style={styles.ajoutText}>Ajout Manuelle des dépenses ou revenus</Text>
            <TouchableOpacity style={styles.button_ajout} onPress={() => navigation.navigate('ManualEntry')}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History Section */}
        <View style={styles.transactionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 17,
    
  },
  add_img: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  felxcontainer:{
    flex:1,
  },
  middle_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flex: 1,
    backgroundColor: "#1E1E2D",
    borderRadius: 8,
    padding: 10,
    marginRight: 10, 
  },
  list:{
    marginBottom:19,
  },
  statItem: {
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 7,
    color: "#A2A2A7",
    textAlign: "center",
  },
  statValue_budget: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#02BC77",
    textAlign: "center",
  },
  statValue_depence: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FF3F60",
    textAlign: "center",
  },
  ajout_container: {
    backgroundColor: "#1E1E2D",
    borderRadius: 8,
    padding: 19,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  ajoutText: {
    fontSize: 14,
    color: "#A2A2A7",
    textAlign: "center",
    marginBottom: 10,
  },
  button_ajout: {
    backgroundColor: "#0066FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    margin: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  balance: {
    marginTop: 26,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161622'
  },
  balanceText: {
    fontSize: 29,
    color: '#fff',
    fontWeight: "bold",
  },
  subText: {
    fontSize: 21,
    color: "#A2A2A7",
    marginBottom: 25,
  },
  first_container_scan: {
    backgroundColor: "#1E1E2D",
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  Second_Container_scan: {
    alignItems: "center",
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: "#707070",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 110,
    paddingVertical: 40,
  },
  scanButtonText: {
    color: "#5D5D60",
    fontSize: 12,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  seeAllText: {
    fontSize: 16,
    color: "#0066FF",
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

export default HomeScreen;