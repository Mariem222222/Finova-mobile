import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';

const notificationsData = [
  {
    id: 1,
    userAvatar: require('../assets/profile.jpg'), 
    Action: 'Withdraw',
    activity: 'of 200 dt',
    time: '2 hours ago',
    date: 'Friday 3:12 PM',
    message: 'Withdrawal has done under the name of House Rent',
  },
  {
    id: 2,
    userAvatar: require('../assets/profile.jpg'),
    Action: 'Deposit',
    activity: 'of 100 dt',
    time: '2 hours ago',
    date: 'Friday 3:04 PM',
  },
  {
    id: 3,
    userAvatar: require('../assets/profile.jpg'),
    Action: 'Withdraw',
    activity: 'of 500 dt',
    time: '3 hours ago',
    date: 'Friday 2:22 PM',
   
  },
  {
    id: 4,
    userAvatar: require('../assets/profile.jpg'),
    Action: 'Adrianna',
    activity: 'of 1000 dt',
    time: '4 hours ago',
    date: 'Friday 1:40 PM',
   
  },
  {
    id: 5,
    userAvatar: require('../assets/profile.jpg'),
    Action: 'Withdraw',
    activity: 'of 1500 dt',
    time: '4 hours ago',
    date: 'Friday 12:16 PM',
  },
  {
    id: 6,
    userAvatar: require('../assets/profile.jpg'),
    Action: 'Withdraw',
    activity: 'of 140 dt',
    time: '5 hours ago',
    date: 'Friday 11:32 AM',
   
  },
  {
    id: 7,
    userAvatar: require('../assets/profile.jpg'),
    Action: 'Withdraw',
    activity: 'of 4780 dt',
    time: '4 hours ago',
    date: 'Friday 12:16 PM',
  },
];

const NotificationPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerBadge}>7</Text>
        </View>
      </View>
      <ScrollView style={styles.notificationList}>
        {notificationsData.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <Image
              source={notification.userAvatar}
              style={styles.userAvatar}
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.Action}>{notification.Action} </Text>
                {notification.activity}
              </Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
              {notification.message && (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>{notification.message}</Text>
                </View>
              )}
            </View>
            <View style={styles.timeIndicator} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#161622', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "#1E1E2D", 
    borderBottomWidth: 1,
    borderBottomColor: '#232533',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  headerBadge: {
    backgroundColor: '#2962ff',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 6,
    fontSize: 12,
  },
  notificationList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232533',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: 'white',
  },
  Action: {
    fontWeight: 'bold',

  },
  notificationDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  messageContainer: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  messageText: {
    fontSize: 14,
  },
  declineButton: {
    backgroundColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  acceptButton: {
    backgroundColor: '#2962ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  downloadIcon: {
    width: 20,
    height: 20,
    marginLeft: 'auto',
  },
  timeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2962ff',
    position: 'absolute',
    top: 20,
    right: -2,
  },
});

export default NotificationPage;