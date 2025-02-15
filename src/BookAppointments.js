import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert,StatusBar } from "react-native";
import * as Location from "expo-location";
import { Text, Button, Card } from "react-native-paper";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#43599D",
  green: "#157A6E",
  red: "#B53737",
  cardBlue: "#293C7A",
  cardGreen: "#1C6034",
  cardRed: "#5A2E2E",
  cardOrange: "#D45C16",
  lightGray: "#1E2D44",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const BookAppointments = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const hospitalLocation = { latitude: 12.934824056954112, longitude: 77.53460811095265 }; // Replace with hospital location
  const proximityThreshold = 5;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to book appointments."
        );
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({ latitude: coords.latitude, longitude: coords.longitude });
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      const dist = haversine(
        latitude,
        longitude,
        hospitalLocation.latitude,
        hospitalLocation.longitude
      );
      setDistance(dist);
    }
  }, [location]);

  const handleProceed = () => {
    if (distance <= proximityThreshold) {
      navigation.navigate("AppointmentPage");
    } else {
      Alert.alert(
        "Out of Range",
        "You are too far from the hospital to book an appointment."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <Text style={styles.heading}>Make Appointment</Text>

      <Card style={styles.card}>
        <Card.Title
          title="Book Appointment"
          subtitle="Check your proximity to the hospital"
          titleStyle={styles.cardTitle}
        />
        <Card.Content>
          {distance !== null ? (
            <Text style={styles.infoText}>
              You are approximately {distance.toFixed(2)} km away from the
              hospital.
            </Text>
          ) : (
            <Text style={styles.infoText}>Calculating your distance...</Text>
          )}
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleProceed}
            disabled={distance === null}
            style={styles.button}
          >
            Proceed
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
    borderBottomColor:COLORS.transparentWhite,
    borderBottomWidth:1,
    fontFamily:"monospace"
  },
  card: {
    width: "100%",
    padding: 15,
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    borderColor: COLORS.transparentWhite,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold", 
    color: COLORS.white,
  },
  infoText: {
    fontSize: 18,
    color: "#E2E8F0",
    marginBottom: 16,
    fontWeight: "bold",
  },
  button: {
    marginTop: 18,
    backgroundColor: COLORS.green,
    width: 150,
    height: 50,
    justifyContent: "center",
    borderColor: COLORS.transparentWhite,
    borderWidth: 0.6,
  },
});

export default BookAppointments;
