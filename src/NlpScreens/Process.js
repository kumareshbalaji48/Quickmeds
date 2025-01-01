/*
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";

const COLORS = {
  primary: "#0A1128",
  white: "#FFFFFF",
  gray: "#2A2A2A",
  blue: "#1849D6",
  green: "#157A6E",
  red: "#B53737",
  cardBackground: "#1E293B",
  lightGray: "#64748B",
  transparentWhite: "rgba(255, 255, 255, 0.7)",
};

const Process = ({ route, navigation }) => {
  const { file, url } = route.params; 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processFile = async () => {
      try {
        let response;

        if (file) {
          
          const formData = new FormData();
          formData.append("file", {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
          });

          response = await axios.post("https://your-backend-url.com/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else if (url) {
          
          response = await axios.post("https://your-backend-url.com/process-url", { url });
        }

        if (response.status === 200) {
          const { summary } = response.data;
          navigation.navigate("Result", { summary });
        } else {
          throw new Error("Failed to process the file or URL.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Something went wrong during processing. Please try again.");
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };

    processFile();
  }, [file, url, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.green} />
      <Text style={styles.text}>Processing your file...</Text>
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
  },
});

export default Process;
*/