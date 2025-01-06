import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";

const AppointmentConfirmation = ({ route, navigation }) => {
  const { details } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan Successfully</Text>
      {/* <Image
        source={require("./assets/token_icon.png")} // Add your token icon in the assets folder
        style={styles.icon}
      /> */}
      <Text style={styles.queueText}>Your Queue Number</Text>
      <Text style={styles.queueNumber}>{details.queueNumber}</Text>
      <Text style={styles.estimatedTime}>
        Estimated turn time: {details.estimatedTurnTime}
      </Text>
      <Text style={styles.appointmentDate}>{details.appointmentDate}</Text>
      <Button
        title="Back to Home"
        onPress={() => navigation.navigate("HomePage")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#001F3F",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f2ff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2c3e50",
  },
  subHeader: {
    fontSize: 18,
    color: "#34495e",
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  queueText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  queueNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2980b9",
    marginVertical: 10,
  },
  estimatedTime: {
    fontSize: 16,
    color: "#34495e",
    marginVertical: 10,
  },
  appointmentDate: {
    fontSize: 14,
    color: "#95a5a6",
    marginBottom: 20,
  },
});

export default AppointmentConfirmation;
