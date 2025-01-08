import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Alert, StyleSheet, Text, Platform } from "react-native";
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
  const { file } = route.params; // The file passed from the previous page
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const extractAndSummarize = async () => {
      if (!file || !file.uri) {
        Alert.alert("Error", "No file selected for upload.");
        setIsLoading(false);
        navigation.goBack(); // Navigate back if no file is provided
        return;
      }

      try {
        const formData = new FormData();
        formData.append("pdfFile", {
          uri: Platform.OS === "android" ? file.uri : file.uri.replace("file://", ""),
          type: "application/pdf",
          name: file.name || "uploaded_file.pdf", // Fallback to default name if not provided
        });

        console.log("Uploading file:", formData);

        // Replace the URL with your actual backend endpoint
        const response = await axios.post("http://192.168.1.6:5000/api/healthcare/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 15000, // 15 seconds timeout
        });

        console.log("Server Response:", response.data);

        if (response.status === 200 && response.data?.summary) {
          setSummary(response.data.summary);
          console.log("Summary set in state:", response.data.summary);
          navigation.navigate("Result", { summary: response.data.summary }); // Navigate to Result page
        } else {
          console.log("Unexpected response format:", response.data);
          Alert.alert("Error", "Failed to extract summary from the file.");
        }
      } catch (error) {
        console.error("Request Error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.statusText ||
          "An error occurred during file processing.";
        Alert.alert("Error", `File processing failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
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
          {"Summary retrieved .... Redirecting to Result Page, OOPs ! you are back here , go to Home page" || "Summary could not be retrieved. Please try again."}
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
    paddingHorizontal: 20,
  },
});

export default Process;
