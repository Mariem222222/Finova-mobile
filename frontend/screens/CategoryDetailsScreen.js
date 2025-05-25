import { View, Text, StyleSheet, ScrollView,Image } from "react-native";
import { useEffect, useState } from 'react';
import ECharts from "../helper/ECharts"; 
import { transactionsApi } from '../api/index';
const CategoryDetailsScreen = ({ route }) => {
  const { category } = route.params;
  const [data, setData] = useState({ chartData: [], transactions: [] });
  const typeMap = {
    'Expense': 'expense',
    'Income': 'income',
    'Loan': 'loan'
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const type = typeMap[category];
        const response = await transactionsApi.get(`/data/${type}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);


  

  const chartOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    series: [
      {
        type: "pie",
        radius: "60%",
        data: data.chartData,
        label: {
          fontSize: 40,
          color: "#fff",
        },
      },
    ],
  };
  const getImage = (category) => {
    const images = {
      shopping: require('../assets/giftcard.png'),
      car: require('../assets/car.png'),
      transfer: require('../assets/revenue.png'),
      payment: require('../assets/revenue.png'),
      deposit: require('../assets/revenue.png'),
      withdrawal: require('../assets/revenue.png'),
      purchase: require('../assets/revenue.png')
    
    };
    return images[category.toLowerCase()] || require('../assets/revenue.png');
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
      {data.transactions.length > 0 ? (
        data.transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionItem}>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
            <View style={styles.transactionDetails}>
            <Image source={getImage(transaction.category)}style={styles.transactionImage}/>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
