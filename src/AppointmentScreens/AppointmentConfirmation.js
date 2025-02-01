import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const AppointmentConfirmation = ({ navigation }) => {
  // Hardcoded details for demonstration
  const patientDetails = {
    name: "Kumaresh B",
    queueNumber: "A01",
    estimatedTime: "08:30   PM",
    appointmentDate: "February 1, 2025"
  };

  return (
    <LinearGradient 
      colors={['#0F0F2D', '#1A1A3D']} 
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.successText}>Done ✓</Text>
        <Text style={styles.header}>Appointment Confirmed!</Text>
        
        <View style={styles.detailsContainer}>
          <Text style={styles.patientName}>
            {patientDetails.name}
          </Text>
          
          <View style={styles.queueContainer}>
            <Text style={styles.queueLabel}>Queue Number</Text>
            <Text style={styles.queueNumber}>{patientDetails.queueNumber}</Text>
          </View>

          <Text style={styles.estimatedTime}>
            Estimated Time: {patientDetails.estimatedTime}
          </Text>
          
          <Text style={styles.appointmentDate}>
            {patientDetails.appointmentDate}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HomePage")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  successText: {
    fontSize: 50,
    color: '#7C83FD',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FFFFFF",
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  patientName: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    fontWeight: '500',
  },
  queueContainer: {
    backgroundColor: 'rgba(124, 131, 253, 0.1)',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  queueLabel: {
    fontSize: 16,
    color: '#A0A3FF',
    marginBottom: 5,
  },
  queueNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: '#7C83FD',
  },
  estimatedTime: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 14,
    color: '#A0A3FF',
  },
  button: {
    backgroundColor: '#7C83FD',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppointmentConfirmation;