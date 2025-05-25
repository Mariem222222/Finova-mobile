import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Profile from "../components/Profile";
import ECharts from "../helper/ECharts"; 
import { Ionicons } from "@expo/vector-icons";
import { getUserInfo } from '../api/index'; 
import { useIsFocused } from '@react-navigation/native';
import { getTransactions } from '../api/index'; 
import { getFinancialRecommendation } from '../api/index'; 

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
   const [Name,setName]=useState("jawhar");
   const isFocused = useIsFocused();
   const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState([]);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [monthlyData, setMonthlyData] = useState({ months: [], seriesData: [] });
useEffect(() => {
  if (isFocused) { 
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUserInfo();
        setName(userData.name || 'Unknown');
         const transactionsResponse = await getTransactions();
         console.log(transactionsResponse)
          if (!transactionsResponse?.transactions) {
            throw new Error('Failed to fetch transactions');
          }
        const processed = processTransactions(transactionsResponse.transactions);
          setMonthlyData(processed);
          setIsAnalyzing(true);
          const analysis = await getFinancialRecommendation();
          console.log(analysis)
          setRecommendation(analysis);
        }
        
       catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
        setIsAnalyzing(false);
      }
    };
    fetchData();
  }
}, [isFocused]);
const processTransactions = (transactions) => {
    // Generate last 6 months
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`);
    }
    if (!Array.isArray(transactions)) {
      console.warn('Transactions data is not an array:', transactions);
      return { months: [], seriesData: [] };
    }
    const monthlySummary = {};
    months.forEach(monthYear => {
      monthlySummary[monthYear] = {
        Savings: 0,
        Spending: 0,
        Investments: 0,
        Goals: 0,
      };
    });

    // Populate data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (monthlySummary[monthYear] && transaction.category in monthlySummary[monthYear]) {
        monthlySummary[monthYear][transaction.category] += Math.abs(transaction.amount);
      }
    });

    // Prepare series data
    const categories = ['Savings', 'Spending', 'Investments', 'Goals'];
    const seriesData = categories.map(category => 
      months.map(monthYear => monthlySummary[monthYear][category])
    );

    return {
      months: months.map(m => m.split(' ')[0]),
      seriesData,
    };
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
const getCategoryColor = (category) => {
  const categoryColors = {
    'Savings': '#4ECDC4',
    'Spending': '#FF3F60',
    'Investments': '#8402BC',
    'Goals': '#4791FF',
    'default': '#7D7E8B'
  };

  return categoryColors[category] || categoryColors.default;
};
  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryDetails", { category });
  };

  const monthlyOption = {
    grid: {
      top: 10,
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: monthlyData.months,
      axisLabel: {
        color: "#fff",
        fontSize: 40,
      },
    },
    yAxis: {
      type: "value",
      axisLabel:{
        fontSize: 20,
        color:'#fff',
      },

    },
    series: [
      {
        data: monthlyData.seriesData[0] || [],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#02BC77",
          width: 7,
        },
      },
      {
        data: monthlyData.seriesData[1] || [],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#FF3F60",
          width: 7,
        },
      },
      {
        data: monthlyData.seriesData[2] || [],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#8402BC",
          width: 7,
        },
      },
      {
        data: monthlyData.seriesData[3] || [],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#4791FF",
          width: 7,
        },
      },
    ],
  };

  const annualOption = {
    grid: {
      top: 10,
      right: 25,
      bottom: 40,
      left: 0,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["2022", "2023", "2024", "2025"],
      axisLabel: {
        color: "#fff",
        fontSize: 40,
      },
    },
    yAxis: {
      type: "value",
      show: true,
      axisLabel: {
        color: "#fff",
        fontSize: 20,
      },
    },
    series: [
      {
        data: [1200],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [1000],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [800],
        type: "bar",
        barWidth: "70%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [1200],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [500],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [400],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [1200],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [800],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [1000],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
      {
        data: [700],
        type: "bar",
        barWidth: "50%",
        itemStyle: {
          color: "#4ECDC4",
          borderRadius: [12, 12, 0, 0],
        },
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("profile")}>
        <Profile
          name={Name}
          profileImage={require("../assets/profile.jpg")}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Monthly Report</Text>
      <View style={[styles.chartContainer]}>
        <ECharts
          option={monthlyOption}
          backgroundColor="#161622"
          width={width - 40}
          height={200}
        />
      </View>
      <View style={styles.categoryContainer}>
        <View>
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: "#FF2366" }]}
          onPress={() => handleCategoryPress("Expense")}
        >
          <Ionicons name="arrow-up-outline" color={"#fff"} size={20}>
          </Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>Expense</Text>
        </View>
        <View>
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: "#02BC77" }]}
          onPress={() => handleCategoryPress("Income")}
        >
          <Ionicons
            name="arrow-down-outline"
            color={"#fff"}
            size={20}
          ></Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>Income</Text>
        </View>
        <View>
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: "#8402BC" }]}
          onPress={() => handleCategoryPress("Loan")}
        >
          <Ionicons name="cash-outline" color={"#fff"} size={20}></Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>Loan</Text>
        </View>
        <View>
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: "#4791FF" }]}
          onPress={() => handleCategoryPress("Savings")}
        >
          <Ionicons
            name="cloud-done-outline"
            color={"#fff"}
            size={20}
          ></Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>Savings</Text>
        </View>
      </View>

      <Text style={styles.title}>Annual Report</Text>
      <View style={[styles.chartContainer]}>
        <ECharts
          option={annualOption}
          backgroundColor="#161622"
          width={width - 40}
          height={300}
        />
      </View>

      <Text style={styles.title}>Recommendation et optimisation</Text>
<View style={styles.recommendationsContainer}>
  {isAnalyzing ? (
    <ActivityIndicator size="small" color="#4ECDC4" />
  ) : recommendation.length > 0 ? (
    recommendation.map((card, index) => (
      <View key={index} style={[
        styles.recommendationCard,
        { borderLeftWidth: 5, borderLeftColor:getCategoryColor(card.category) }
      ]}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardCategory}>{card.category} Advice</Text>
        <Text style={styles.cardDetail}>{card.detail}</Text>
        <View style={styles.actionItemsContainer}>
          {card.actionItems.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.actionItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.actionText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    ))
  ) : (
    <Text style={styles.recommendationText}>
      No financial recommendations available. Your finances look healthy!
    </Text>
  )}
</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 17,
    backgroundColor: "#161622",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },
  chartContainer: {
    borderRadius: 12,
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginBottom: 30,
  },
  categoryButton: {
    padding: 19,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_icon:{
    color:"#fff",
    textAlign:"center",
  },
  recommendationsContainer: {
    marginBottom: 25,
  },
  cardCategory: {
  color: '#7D7E8B',
  fontSize: 12,
  fontWeight: '500',
  marginBottom: 4,
  textTransform: 'uppercase',
},
recommendationCard: {
  backgroundColor: "#232533",
  padding: 16,
  borderRadius: 8,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
  cardTitle: {
    color: "#4ECDC4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardDetail: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  actionItemsContainer: {
    marginLeft: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bullet: {
    color: "#FFFFFF",
    marginRight: 8,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
  },
  // Keep your existing recommendationContainer as fallback
  recommendationContainer: {
    backgroundColor: "#232533",
    padding: 20,
    marginBottom: 25,
    borderRadius: 12,
  },
  recommendationText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default StatisticsScreen;
