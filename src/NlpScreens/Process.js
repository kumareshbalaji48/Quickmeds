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
  const { file, text } = route.params; 
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const processData = async () => {
      if (!file && !text) {
        Alert.alert("Error", "No file or text provided for processing.");
        setIsLoading(false);
        navigation.goBack();
        return;
      }

      try {
        const formData = new FormData();

       
        if (file && file.uri) {
          formData.append("pdfFile", {
            uri: Platform.OS === "android" ? file.uri : file.uri.replace("file://", ""),
            type: "application/pdf",
            name: file.name || "uploaded_file.pdf", 
          });
        }

        
        if (text) {
          formData.append("text", text);
        }

        
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        //backend url
        const response = await axios.post("http://192.168.1.8:5000/api/healthcare/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 15000, 
        });

        console.log("Server Response:", response.data);

        if (response.status === 200 && response.data?.summary) {
          setSummary(response.data.summary);
          console.log("Summary set in state:", response.data.summary);
          navigation.navigate("Result", { summary: response.data.summary }); // Result page
        } else {
          console.log("Unexpected response format:", response.data);
          Alert.alert("Error", "Failed to extract summary from the file or text.");
        }
      } catch (error) {
        console.error("Request Error:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.response?.statusText ||
          "An error occurred during file or text processing.";
        Alert.alert("Error", `Processing failed: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    processData();
  }, [file, text, navigation]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.green} />
      ) : (
        <Text style={styles.text}>
          {summary
            ? "Summary retrieved. Redirecting to Result Page..."
            : "Summary could not be retrieved. Please try again."}
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