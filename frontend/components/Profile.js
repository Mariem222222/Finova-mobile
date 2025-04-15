import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons"; 
import { useNavigation } from '@react-navigation/native'; 

const Profile = ({ name, profileImage}) => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      <View style={styles.container_profile} >
        <Image source={profileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Notifications")}> 
        <View style={styles.container_notification}>
          <Ionicons name="notifications-outline" size={20} style={styles.icon}/>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom:20,
    flexDirection: 'row', 
    backgroundColor: '#161622',
  },
  icon: {
    color:'white',
    justifyContent: 'center',
    flexDirection:'column',
    alignItems: 'center' ,
    padding:10 
  },
  container_profile:{
    flex:1,
    flexDirection: 'row',
    backgroundColor: '#161622',
  },
  container_notification:{
    borderRadius: 70,
    backgroundColor:"#1E1E2D",
    margin:10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom:5,
  },
  nameText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default Profile;