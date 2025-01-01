import React, { useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Image, 
  Text 
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  blue: "#4F73DF",
};

const MedicalRecords = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.title}>Medical Records</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() =>
            navigation.navigate("AddNotes")
          }
        >
          <Image
            source={require("../../assets/images/reportssection/notes.png")}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Add Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Reports")}
        >
          <Image
            source={require("../../assets/images/reportssection/history.png")}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Medical Reports</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    borderBottomColor: COLORS.white,
    borderBottomWidth: 1,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    marginTop: 25,
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.white,
    paddingBottom: 10,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  optionButton: {
    backgroundColor: COLORS.blue,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  optionIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  optionText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});

export default MedicalRecords;
