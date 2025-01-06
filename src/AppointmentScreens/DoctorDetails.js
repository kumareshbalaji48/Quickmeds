import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const DoctorDetails = ({ route, navigation }) => {
  const { doctor } = route.params;

  const handleBookAppointment = () => {
    // Navigate to the confirmation screen with hardcoded appointment details
    const appointmentDetails = {
      queueNumber: "A-12",
      estimatedTurnTime: "08:45 - 09:00",
      appointmentDate: "Wednesday, 02 Jan 2025",
      doctorName: doctor.name,
      specialization: doctor.specialty,
    };

    navigation.navigate("AppointmentConfirmation", {
      details: appointmentDetails,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Details</Text>
      </View>
      <Image source={doctor.image} style={styles.doctorImage} />
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
      <Text style={styles.doctorPrice}>{doctor.price}</Text>
      <View style={styles.ratingContainer}>
        <Icon name="star" size={20} color="#FFA500" />
        <Text style={styles.rating}>{doctor.rating}</Text>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookAppointment}
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
    alignItems: "center",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  doctorName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  doctorSpecialty: {
    color: "#a0a0a0",
    fontSize: 16,
    marginBottom: 8,
  },
  doctorPrice: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  rating: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 8,
  },
  bookButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 8,
    padding: 12,
    width: "80%",
    alignItems: "center",
  },
  bookButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DoctorDetails;
