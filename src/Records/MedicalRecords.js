import React from "react";
import { View, StyleSheet,StatusBar, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onLog } from "@react-native-firebase/app";

const COLORS = {
  primary: "#020E22",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#4F73DF",
  green: "#157A6E",
  red: "#B53737",
  cardBlue: "#293C7A",
  cardGreen: "#1C6034",
  cardRed: "#5A2E2E",
  cardOrange: "#D45C16",
  lightGray: "#1E2D44",
  transparentWhite: "rgba(255, 255, 255, 0.7)", 
};


const MedicalRecords = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      <View style={{borderBottomColor:COLORS.white,
    borderBottomWidth:1,}}>
      <Text style={styles.title}>Medical Records</Text>
      </View>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("AddNotes")}
        >
          <Image
            source={require("../../assets/images/reportssection/notes.png")}
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Add Notes</Text>
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
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent:"center",
  },
  
  title: {
    marginTop:25,
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 0,
    fontFamily:"monospace",
    
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  optionButton: {
    backgroundColor: COLORS.blue,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: 150,
    height:150,
  },
  optionIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  optionText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MedicalRecords;
