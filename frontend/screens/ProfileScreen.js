import React, { useState,useEffect } from "react";
import Profile from "../components/Profile";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity,ActivityIndicator,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useIsFocused } from '@react-navigation/native';
import { getUserInfo, deleteUser } from '../api/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
  

const ProfileScreen = ({ navigation }) => {
  const [Name,setName]=useState("jawhar");
  const isFocused = useIsFocused();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
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
        const handleDeleteProfile = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer définitivement votre profil ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Supprimer", 
          onPress: async () => {
            try {
              setIsDeleting(true);
              // Appel à l'API de suppression
              await deleteUser(); 
              // Suppression des données locales
              await AsyncStorage.multiRemove(['userToken', 'userData']);
              
              // Redirection vers l'écran de login
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            } catch (error) {
              Alert.alert('Erreur', error.message || 'Échec de la suppression du profil');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };
        const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      // Redirect to Login screen and clear navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };
             if (loading|| isDeleting) {
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
          <Text style={styles.optionText}>Backup and Restore</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('TransactionHistory')}>
          <Icon name="history" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>History</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Icon name="eco" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Best consumption practice</Text>
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
        {/* Bouton de déconnexion */}
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Icon name="exit-to-app" size={24} color="#fff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Logout</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
          </TouchableOpacity>
          {/* Bouton de suppression */}
        <TouchableOpacity 
          style={[styles.option, styles.destructiveButton]} 
          onPress={handleDeleteProfile}
        >
          <Icon name="delete-forever" size={24} color="#ff4444" style={styles.optionIcon} />
          <Text style={[styles.optionText, styles.destructiveText]}>Delete Account</Text>
          <Icon name="arrow-forward-ios" size={20} color="#ff4444" />
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
  destructiveButton: {
    borderBottomColor: '#ff4444',
  },
  destructiveText: {
    color: '#ff4444'
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