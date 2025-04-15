import { View, Text, StyleSheet, ScrollView,Image } from "react-native";
import ECharts from "../helper/ECharts"; 

const CategoryDetailsScreen = ({ route }) => {
  const { category } = route.params;

  const categoryData = {
    Dépenses: {
      chartData: [
        { name: "Cash", value: 49 },
        { name: "Travel", value: 20 },
        { name: "Food", value: 15 },
        { name: "Shopping", value: 10 },
        { name: "Car", value: 6 },
      ],
      transactions: [
        { date: "Today", description: "Gift Card", amount: -19.2, category: "Shopping", imageUrl: require("../assets/giftcard.png") },
        { date: "Today", description: "Car Insurance", amount: -200, category: "Car",imageUrl: require("../assets/car.png") },
        { date: "Last 7 Days", description: "House", amount: -300, category: "Cash",imageUrl: require("../assets/revenue.png") },
      ],
    },
    Revenus: {
      chartData: [
        { name: "Salary", value: 70 },
        { name: "Investments", value: 20 },
        { name: "Freelance", value: 10 },
      ],
      transactions: [
        { date: "Today", description: "Salary", amount: 2500, category: "Salary",imageUrl: require("../assets/revenue.png") },
        { date: "Last 7 Days", description: "Freelance Project", amount: 500, category: "Freelance",imageUrl: require("../assets/revenue.png") },
      ],
    },
    Loan: {
      chartData: [
        { name: "Mortgage", value: 60 },
        { name: "Car Loan", value: 30 },
        { name: "Personal Loan", value: 10 },
      ],
      transactions: [
        { date: "Today", description: "Mortgage Payment", amount: -1200, category: "Mortgage",imageUrl: require("../assets/revenue.png") },
        { date: "Last 7 Days", description: "Car Loan Payment", amount: -300, category: "Car Loan",imageUrl: require("../assets/car.png") },
      ],
    },
    "L'épargne": {
      chartData: [
        { name: "Savings Account", value: 50 },
        { name: "Investments", value: 30 },
        { name: "Retirement", value: 20 },
      ],
      transactions: [
        { date: "Today", description: "Savings Deposit", amount: 500, category: "Savings Account",imageUrl: require("../assets/revenue.png") },
        { date: "Last 7 Days", description: "Investment Deposit", amount: 300, category: "Investments",imageUrl: require("../assets/revenue.png") },
      ],
    },
  };

  const { chartData = [], transactions = [] } = categoryData[category] || {};

  const chartOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: chartData,
        label: {
          fontSize: 40,
          color: "#fff",
        },
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{category}</Text>

      {/* ECharts Pie Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Category Chart</Text>
        <View style={styles.chartWrapper}>
          <ECharts option={chartOption} 
          backgroundColor="#161622"
          />
        </View>
      </View>

      {/* Transaction History */}
      <Text style={styles.sectionTitle}>Transaction History</Text>
      {transactions.length > 0 ? (
        transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
            <View style={styles.transactionDetails}>
            <Image source={typeof transaction.imageUrl === 'string' ? { uri: transaction.imageUrl } : transaction.imageUrl}
              style={styles.transactionImage}/>
             
              <View styles={styles.textContainer}>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactioncategory}>{transaction.category}</Text>
              </View>
              <View style={styles.space_Container}></View>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#161622",
  },
  space_Container:{
    flex:1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  chartContainer: {
    marginBottom: 20,
    backgroundColor: "#161622",
  },
  chartTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartWrapper: {
    height: 300, 
    borderRadius: 10,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  transactionItem: {
    marginBottom: 15,
   
  },
  transactionDate: {
    fontSize: 16,
    color: "#fff",
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
  transactioncategory: {
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
});

export default CategoryDetailsScreen;
