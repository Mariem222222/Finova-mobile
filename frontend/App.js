import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppFirstScreen from "./screens/AppFirstScreen"; 
import OnboardingScreen from "./screens/OnboardingScreen"; 
import HomeScreen from "./screens/HomeScreen"; 
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SignInPage";
import TwoStepVerificationScreen from "./components/TwoStepVerificationPage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; 
import StatisticsScreen from "./screens/StatisticsScreen";
import CategoryDetailsScreen from "./screens/CategoryDetailsScreen";
import ManagementScreen from "./screens/ManagementScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";
import ManualEntryScreen from "./screens/ManualEntryScreen";
import RevenueForm from "./components/RevenueForm";
import ExpenseForm from "./components/ExpenseForm";
import LoanForm from "./components/LoanForm";
import AddBudget from "./components/AddBudget";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import ModifierBudget from "./components/ModifierBudget";
import NotificationPage from "./components/NotificationPage";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainAppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Statistics") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Management") {
            iconName = focused ? "business" : "business-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0066FF",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#27273A",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} />
      <Tab.Screen name="Management" component={ManagementScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        
        <Stack.Screen
          name="Splash"
          component={AppFirstScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="SignIn"
          component={SignInPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TwoStepVerification"
          component={TwoStepVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainAppTabs}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="CategoryDetails"
          component={CategoryDetailsScreen}
          options={{ headerShown: false  }}
        />
         <Stack.Screen 
         name="EditProfile" 
         component={EditProfileScreen} 
         options={{ headerShown: false  }}/>
         
          <Stack.Screen 
          name="profile" 
          component={ProfileScreen} 
          options={{ headerShown: false  }} />

           <Stack.Screen 
           name="TransactionHistory" 
           component={TransactionHistoryScreen}
           options={{ headerShown: false  }} />

           <Stack.Screen
          name="ManualEntry"
          component={ManualEntryScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="RevenueForm"
          component={RevenueForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpenseForm"
          component={ExpenseForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoanForm"
          component={LoanForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="AddBudget" 
        component={AddBudget} 
        options={{ headerShown: false }}/>

         <Stack.Screen 
        name="ModifierBudget" 
        component={ModifierBudget} 
        options={{ headerShown: false }}/>

        <Stack.Screen 
        name="ChangePassword" 
        component={ChangePasswordScreen} 
        options={{ headerShown: false }}/>

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="Notifications" 
        component={NotificationPage}
        options={{ headerShown: false }} />

      </Stack.Navigator>
     
    </NavigationContainer>
  );
}