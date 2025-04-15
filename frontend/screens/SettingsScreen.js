import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const SettingsScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Settings</Text>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Language</Text>
          <Text style={styles.optionValue}>English</Text>
        </TouchableOpacity>
      </View>

      {/* My Profile Section */}
      <View style={styles.section}>
       
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.optionText}>Edit Profile</Text>
          <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contact Us Section */}
      <View style={styles.section}>
       
        <TouchableOpacity style={styles.option}>
                   <Text style={styles.optionText}>Contact us</Text>
                   <Icon name="arrow-forward-ios" size={20} color="#fff" />
        </TouchableOpacity>
       
      </View>

      {/* Security Section */}
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Security</Text>
     
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('ChangePassword')} 
        >
          <Text style={styles.optionText}>Change Password</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#A2A2A7',

  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232533',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  optionValue: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsScreen;