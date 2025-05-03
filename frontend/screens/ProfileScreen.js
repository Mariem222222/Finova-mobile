import React, { useState,useEffect } from "react";
import Profile from "../components/Profile";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,ActivityIndicator  } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useIsFocused } from '@react-navigation/native';
import { getUserInfo } from '../api/index'; 
  

const ProfileScreen = ({ navigation }) => {
  const [Name,setName]=useState("jawhar");
  const isFocused = useIsFocused();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
   useEffect(() => {
      if (isFocused) { 
        const fetchdata = async () => {
              try {
               
                const userData = await getUserInfo();
                setName(userData.name|| 'Unknown'); } catch (err) {
                  setError(err.message);
                }
                setLoading(false);
              };fetchdata()}
            }, [isFocused]);
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
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Profile name={Name} profileImage={require("../assets/profile.jpg")}/>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        {/* "Personal Information" Option with Icon */}
        <TouchableOpacity style={styles.option}>
          <Icon name="person-outline" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Personal Information</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Other Options */}
        <TouchableOpacity style={styles.option}>
          <Icon name="save" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Sauvegarde et restauration</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('TransactionHistory')}>
          <Icon name="history" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Historique</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="eco" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Meilleure pratique de consomation</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="location-on" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Address</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Settings</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#161622',
  },
  section: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#232533',
    
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 17,
    color: '#fff',
  },
});

export default ProfileScreen;