import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const COLORS = {
  primary: "#0A1128",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#1849D6",
  green: "#157A6E",
  red: "#B53737",
};

const Process = ({ route }) => {
  const { file } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const extractAndSummarize = async () => {
      try {
        const formData = new FormData();
        formData.append("pdf", {
          uri: file.uri,
          type: "application/pdf",
          name: file.name,
        });

        console.log("Uploading file:", file.uri);

        const response = await axios.post(
          "http://192.168.1.7:5000/backend",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Check if summary is present in response
        if (response.data?.summary) {
          setSummary(response.data.summary);
        } else {
          Alert.alert("Error", "Failed to extract summary from the file.");
        }
      } catch (error) {
        console.error("Request Error:", error.message);

        const errorMessage = error.response?.data?.message
          ? error.response.data.message
          : "An error occurred during file processing.";
        Alert.alert("Error", errorMessage);
      } finally {
        setIsLoading(false);
        navigation.navigate("Result", { summary });
      }
    };

    extractAndSummarize();
  }, [file, navigation]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.green} />
      ) : (
        <Text style={styles.text}>
          {summary || "Summary could not be retrieved."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.white,
    textAlign: "center",
  },
});

export default Process;
