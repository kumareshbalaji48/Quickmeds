import React from "react";
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Text 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-paper/src/components/Icon";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  blue: "#4F73DF",
  secondary: "#1A2E4D",
};

const AppointmentsLandingpage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Appointment Services</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Live Bookings Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("BookAppointments")}
        >
          <View style={styles.iconContainer}>
            <Icon
              source="calendar-clock"
              color={COLORS.white}
              size={50}
              theme={{ colors: { text: COLORS.white } }}
            />
          </View>
          <Text style={styles.optionText}>Live-Book Appointment</Text>
        </TouchableOpacity>

        {/* Pre-Book Appointment Card */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.navigate("PreBookAppointment")}
        >
          <View style={styles.iconContainer}>
            <Icon
              source="calendar-plus"
              color={COLORS.white}
              size={50}
              theme={{ colors: { text: COLORS.white } }}
            />
          </View>
          <Text style={styles.optionText}>Pre-Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 20,
  },
  header: {
    paddingVertical: 30,
    marginBottom: 187,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  optionCard: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  iconContainer: {
    backgroundColor: COLORS.blue,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  optionText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default AppointmentsLandingpage;