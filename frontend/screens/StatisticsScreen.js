import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Profile from "../components/Profile";
import ECharts from "../helper/ECharts"; 
import { Ionicons } from "@expo/vector-icons";

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

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
      data: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
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
        data: [25, 19, 20, 21, 16, 15],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#02BC77",
          width: 7,
        },
      },
      {
        data: [15, 5, 10, 31, 36, 30],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#FF3F60",
          width: 7,
        },
      },
      {
        data: [20, 25, 35, 31, 26, 24],
        type: "line",
        smooth: true,
        lineStyle: {
          color: "#8402BC",
          width: 7,
        },
      },
      {
        data: [10, 15, 25, 21, 10, 9],
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
          name="Jawhar Soussia"
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
          onPress={() => handleCategoryPress("Dépenses")}
        >
          <Ionicons name="arrow-up-outline" color={"#fff"} size={20}>
          </Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>Dépenses</Text>
        </View>
        <View>
        <TouchableOpacity
          style={[styles.categoryButton, { backgroundColor: "#02BC77" }]}
          onPress={() => handleCategoryPress("Revenus")}
        >
          <Ionicons
            name="arrow-down-outline"
            color={"#fff"}
            size={20}
          ></Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>Revenus</Text>
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
          onPress={() => handleCategoryPress("L'épargne")}
        >
          <Ionicons
            name="cloud-done-outline"
            color={"#fff"}
            size={20}
          ></Ionicons>
        </TouchableOpacity>
        <Text style={styles.text_icon}>L'epagne</Text>
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
      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationText}>
          Here are some recommendations to optimize your finances...
        </Text>
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
  text_icon:{
    color:"#fff",
    textAlign:"center",
  },
  recommendationContainer: {
    backgroundColor: "#232533",
    padding: 20,
    marginBottom:25,
    borderRadius: 12,
  },
  recommendationText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
  },
});

export default StatisticsScreen;
