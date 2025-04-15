import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';

const EditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('Tanya Myroniuk');
  const [email, setEmail] = useState('tanya.myroniuk@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+8801712663389');
  const [day, setDay] = useState('28');
  const [month, setMonth] = useState('September');
  const [year, setYear] = useState('2000');
  const [name, setName] = useState('Jawhar Soussia');

  const handleSave = () => {
    const birthDate = `${day} ${month} ${year}`;
    console.log('Profile saved:', { fullName, email, phoneNumber, birthDate });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.container_profile}>
          <Image source={require('../assets/profile.jpg')} style={styles.profileImage} />
          <View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.nameText}>{name}</Text>
          </View>
        </View>
      </View>

      {/* Full Name */}
      <View style={styles.section}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
        />
      </View>

      {/* Email Address */}
      <View style={styles.section}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          keyboardType="email-address"
        />
      </View>

      {/* Phone Number */}
      <View style={styles.section}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
      </View>

      {/* Birth Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Birth Date</Text>
        <View style={styles.birthDateContainer}>
          <TextInput
            style={[styles.input, styles.birthDateInput]}
            value={day}
            onChangeText={setDay}
            placeholder="Day"
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={[styles.input, styles.birthDateInput]}
            value={month}
            onChangeText={setMonth}
            placeholder="Month"
            maxLength={9}
          />
          <TextInput
            style={[styles.input, styles.birthDateInput]}
            value={year}
            onChangeText={setYear}
            placeholder="Year"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </View>

      {/* Joined Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Joined</Text>
        <Text style={styles.joinedDate}>28 Jan 2021</Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#161622',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    margin: 10,
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    margin: 20,
    borderRadius: 50,
  },
  container_profile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#161622',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  nameText: {
    fontSize: 20,
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#A2A2A7',
  },
  input: {
    borderColor: '#232533',
    borderBottomWidth: 1,
    padding: 12,
    fontSize: 16,
    color: '#fff',
  },
  birthDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  birthDateInput: {
    flex: 1,
    marginRight: 10,
    textAlign:"center",
  },
  joinedDate: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EditProfileScreen;