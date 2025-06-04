import React, { useState,useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Profile from '../components/Profile';
import { getTransactions, getUserInfo, getCurrentSavings, getCurrentExpenses } from '../api/index';
import { useIsFocused } from '@react-navigation/native';



const HomeScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance,setbalance]=useState(800);
  const [Name,setName]=useState("jawhar");
  const [actualExpenses, setActualExpenses] = useState(150);
  const [error, setError] = useState(null);
  const [savings, setSavings] = useState(8000);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) { 
      const fetchData = async () => {
        try {
        const [userData, response, saves, expen] = await Promise.all([
          getUserInfo(),
          getTransactions(),
          getCurrentSavings(),
          getCurrentExpenses()
        ]);
        
        console.log("User Data:", userData);
        console.log("Transactions:", response);
        console.log("Savings:", saves);
        console.log("Expenses:", expen);


          setSavings(saves.currentSavings)
          setActualExpenses(expen.currentExpenses)

          const formattedTransactions = response.transactions.map(tx => ({
            ...tx,
            amount: tx.type === 'income' ? tx.amount : -tx.amount,
          }));
          setName(userData.name|| 'Unknown'); 
          setbalance(userData.balance|| 'N/A');
          setTransactions(formattedTransactions);
        } catch (err) {
          setError(err.message);
        }
        setLoading(false);
      };
      fetchData()
    }
  }, [isFocused]);
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
    <ScrollView style={styles.scrollContainer}>
      {/* Header Content */}
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('profile')}>
          <Profile name={Name} profileImage={require("../assets/profile.jpg")} />
        </TouchableOpacity>
        <View style={styles.balance}>
          <Text style={styles.balanceText}>${balance}</Text>
          <Text style={styles.subText}>Current Balance</Text>
        </View>
        <View style={styles.first_container_scan}>
          <TouchableOpacity onPress={() => navigation.navigate('InvoiceScanner')}>
            <View style={styles.Second_Container_scan}>
              <Image source={require("../assets/add.png")} style={styles.add_img} />
              <Text style={styles.scanButtonText}>Scan Invoice</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Middle Container with Budget and Expenses */}
        <View style={styles.middle_container}>
          {/* Budget and Expenses Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Savings</Text>
              <Text style={styles.statValue_budget}>${savings.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Actual Expenses</Text>
              <Text style={styles.statValue_depence}>${actualExpenses.toFixed(2)}</Text>
            </View>
          </View>

          {/* Manual Add Section */}
          <View style={styles.ajout_container}>
            <Text style={styles.ajoutText}>Manually adding expenses or income</Text>
            <TouchableOpacity style={styles.button_ajout}  onPress={() => navigation.navigate('ManualEntry')}>
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
       {transactions.length>0 ? (
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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