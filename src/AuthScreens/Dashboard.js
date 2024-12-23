import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import auth from "@react-native-firebase/auth";
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error during logout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Dashboard</Text>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#BEBD88",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#841584",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
